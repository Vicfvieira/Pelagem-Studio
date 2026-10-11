import { describe, expect, it } from "vitest";

import { saoPauloDateTime } from "@/lib/business-rules";
import { getAvailableSlots, isSlotAvailable, type BusyInterval } from "@/lib/scheduling";

// "Agora": quarta-feira, 14/10/2026, 08:00 em São Paulo (antes da abertura).
const WEDNESDAY = "2026-10-14";
const NOW = saoPauloDateTime(WEDNESDAY, 8 * 60);

/** Agendamento ativo em São Paulo, de "HH:mm" a "HH:mm". */
function busy(date: string, from: string, to: string): BusyInterval {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  return { startAt: saoPauloDateTime(date, toMinutes(from)), endAt: saoPauloDateTime(date, toMinutes(to)) };
}

function times(date: string, durationMinutes: number, appointments: BusyInterval[] = [], now = NOW) {
  return getAvailableSlots({ date, durationMinutes, appointments, now }).slots.map((s) => s.time);
}

describe("getAvailableSlots", () => {
  describe("dia livre", () => {
    it("oferece de 9h até o último início que termina às 18h, de 30 em 30 min", () => {
      const result = getAvailableSlots({ date: WEDNESDAY, durationMinutes: 60, appointments: [], now: NOW });
      expect(result.reason).toBeNull();
      expect(result.slots).toHaveLength(17);
      expect(result.slots[0]).toMatchObject({ time: "09:00", remaining: 2 });
      expect(result.slots.at(-1)?.time).toBe("17:00");
    });

    it("devolve início e fim em UTC (São Paulo é UTC-3)", () => {
      const [first] = getAvailableSlots({ date: WEDNESDAY, durationMinutes: 90, appointments: [], now: NOW }).slots;
      expect(first.startAt).toBe("2026-10-14T12:00:00.000Z");
      expect(first.endAt).toBe("2026-10-14T13:30:00.000Z");
    });
  });

  describe("dia fechado", () => {
    it.each([
      ["domingo", "2026-10-18"],
      ["segunda-feira", "2026-10-19"],
    ])("não abre no %s", (_, date) => {
      expect(getAvailableSlots({ date, durationMinutes: 60, appointments: [], now: NOW })).toEqual({
        slots: [],
        reason: "DIA_FECHADO",
      });
    });

    it("abre de terça a sábado", () => {
      for (const date of ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24"]) {
        expect(getAvailableSlots({ date, durationMinutes: 60, appointments: [], now: NOW }).reason).toBeNull();
      }
    });
  });

  describe("slot lotado", () => {
    it("bloqueia o slot com 2 atendimentos e todo serviço que passaria por ele", () => {
      const full = [busy(WEDNESDAY, "10:00", "11:00"), busy(WEDNESDAY, "10:00", "11:00")];

      const thirty = times(WEDNESDAY, 30, full);
      expect(thirty).toContain("09:30");
      expect(thirty).not.toContain("10:00");
      expect(thirty).not.toContain("10:30");
      expect(thirty).toContain("11:00");

      // 60 min às 9h30 cruzaria o slot das 10h, lotado.
      const sixty = times(WEDNESDAY, 60, full);
      expect(sixty).toContain("09:00");
      expect(sixty).not.toContain("09:30");
    });

    it("com 1 atendimento o slot continua livre, com 1 vaga", () => {
      const result = getAvailableSlots({
        date: WEDNESDAY,
        durationMinutes: 30,
        appointments: [busy(WEDNESDAY, "10:00", "10:30")],
        now: NOW,
      });
      expect(result.slots.find((s) => s.time === "10:00")?.remaining).toBe(1);
      expect(result.slots.find((s) => s.time === "10:30")?.remaining).toBe(2);
    });

    it("dia totalmente lotado é válido, mas sem horários", () => {
      const allDay = [busy(WEDNESDAY, "09:00", "18:00"), busy(WEDNESDAY, "09:00", "18:00")];
      expect(getAvailableSlots({ date: WEDNESDAY, durationMinutes: 30, appointments: allDay, now: NOW })).toEqual({
        slots: [],
        reason: null,
      });
    });
  });

  describe("sobreposição", () => {
    it("soma atendimentos de durações diferentes que se cruzam", () => {
      // 10:30–11:00 tem os dois atendimentos ao mesmo tempo.
      const appointments = [busy(WEDNESDAY, "09:00", "11:00"), busy(WEDNESDAY, "10:30", "12:00")];
      const result = getAvailableSlots({ date: WEDNESDAY, durationMinutes: 90, appointments, now: NOW });
      const ninety = result.slots.map((s) => s.time);
      // 9:00–10:30 só cruza o primeiro atendimento e termina quando o slot lotado começa.
      expect(result.slots.find((s) => s.time === "09:00")?.remaining).toBe(1);
      expect(ninety).not.toContain("09:30"); // passaria por 10:30–11:00, lotado
      expect(ninety).not.toContain("10:00");
      expect(ninety).not.toContain("10:30");
      expect(result.slots.find((s) => s.time === "11:00")?.remaining).toBe(1); // só o segundo
    });

    it("considera atendimentos fora da grade de 30 min nos dois slots que tocam", () => {
      const appointments = [busy(WEDNESDAY, "10:15", "10:45"), busy(WEDNESDAY, "10:15", "10:45")];
      const thirty = times(WEDNESDAY, 30, appointments);
      expect(thirty).not.toContain("10:00");
      expect(thirty).not.toContain("10:30");
      expect(thirty).toContain("11:00");
    });

    it("atendimento que termina exatamente no início do slot não ocupa o slot", () => {
      const appointments = [busy(WEDNESDAY, "09:00", "10:00"), busy(WEDNESDAY, "09:00", "10:00")];
      expect(times(WEDNESDAY, 30, appointments)[0]).toBe("10:00");
    });
  });

  describe("depois do fechamento", () => {
    it.each([
      [30, "17:30"],
      [120, "16:00"],
      [180, "15:00"],
    ])("serviço de %i min tem último início às %s", (duration, last) => {
      expect(times(WEDNESDAY, duration).at(-1)).toBe(last);
    });

    it("nenhum horário termina depois das 18h", () => {
      const close = saoPauloDateTime(WEDNESDAY, 18 * 60).getTime();
      const { slots } = getAvailableSlots({ date: WEDNESDAY, durationMinutes: 150, appointments: [], now: NOW });
      expect(slots.every((s) => new Date(s.endAt).getTime() <= close)).toBe(true);
    });
  });

  describe("passado", () => {
    it("recusa datas anteriores a hoje", () => {
      expect(getAvailableSlots({ date: "2026-10-13", durationMinutes: 60, appointments: [], now: NOW })).toEqual({
        slots: [],
        reason: "DATA_PASSADA",
      });
    });

    it("hoje, só oferece horários que ainda não começaram", () => {
      const midday = saoPauloDateTime(WEDNESDAY, 13 * 60 + 10); // 13:10
      expect(times(WEDNESDAY, 30, [], midday)[0]).toBe("13:30");
    });

    it("hoje, depois do último início possível, não há horários", () => {
      const evening = saoPauloDateTime(WEDNESDAY, 17 * 60 + 45);
      expect(getAvailableSlots({ date: WEDNESDAY, durationMinutes: 30, appointments: [], now: evening })).toEqual({
        slots: [],
        reason: null,
      });
    });
  });

  describe("mais de 30 dias", () => {
    it("aceita exatamente 30 dias à frente", () => {
      // 14/10 + 30 dias = 13/11/2026, sexta-feira.
      expect(getAvailableSlots({ date: "2026-11-13", durationMinutes: 60, appointments: [], now: NOW }).reason).toBeNull();
    });

    it("recusa 31 dias ou mais", () => {
      expect(getAvailableSlots({ date: "2026-11-14", durationMinutes: 60, appointments: [], now: NOW })).toEqual({
        slots: [],
        reason: "ALEM_DO_LIMITE",
      });
    });

    it("conta os dias pela data de São Paulo, não pela UTC", () => {
      // 23:30 de 14/10 em SP já é 15/10 em UTC; o limite continua sendo 13/11.
      const lateNight = saoPauloDateTime(WEDNESDAY, 23 * 60 + 30);
      expect(getAvailableSlots({ date: "2026-11-14", durationMinutes: 60, appointments: [], now: lateNight }).reason).toBe(
        "ALEM_DO_LIMITE",
      );
    });
  });

  describe("duração inválida", () => {
    it.each([0, -30, 45, 600, 1.5])("recusa %d min", (duration) => {
      expect(getAvailableSlots({ date: WEDNESDAY, durationMinutes: duration, appointments: [], now: NOW }).reason).toBe(
        "DURACAO_INVALIDA",
      );
    });
  });
});

describe("isSlotAvailable", () => {
  const base = { date: WEDNESDAY, durationMinutes: 60, now: NOW };

  it("confirma um horário livre", () => {
    expect(isSlotAvailable({ ...base, appointments: [], startAt: saoPauloDateTime(WEDNESDAY, 9 * 60) })).toBe(true);
  });

  it("recusa horário lotado, fora da grade ou após o fechamento", () => {
    const full = [busy(WEDNESDAY, "09:00", "10:00"), busy(WEDNESDAY, "09:00", "10:00")];
    expect(isSlotAvailable({ ...base, appointments: full, startAt: saoPauloDateTime(WEDNESDAY, 9 * 60) })).toBe(false);
    expect(isSlotAvailable({ ...base, appointments: [], startAt: saoPauloDateTime(WEDNESDAY, 9 * 60 + 15) })).toBe(false);
    expect(isSlotAvailable({ ...base, appointments: [], startAt: saoPauloDateTime(WEDNESDAY, 17 * 60 + 30) })).toBe(false);
  });
});
