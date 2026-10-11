"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { FormProvider, useForm, useWatch, type FieldPath } from "react-hook-form";

import { FormAlert } from "@/components/auth/form-alert";
import { BOOKING_STEPS, BookingProgress } from "@/components/booking/booking-progress";
import { BookingSuccess } from "@/components/booking/booking-success";
import { StepDateTime } from "@/components/booking/step-datetime";
import { StepPet } from "@/components/booking/step-pet";
import { StepReview } from "@/components/booking/step-review";
import { StepService } from "@/components/booking/step-service";
import { StepTaxi } from "@/components/booking/step-taxi";
import type { WizardPet } from "@/components/booking/types";
import { Button } from "@/components/ui/button";
import { createAppointmentAction } from "@/lib/booking/actions";
import type { BookingSummary } from "@/lib/booking/book";
import type { TaxiQuote } from "@/lib/booking/taxi";
import type { CatalogService } from "@/lib/data/services";
import { bookingSchema, type BookingInput } from "@/lib/validation/booking";

const STEP_TITLES = [
  "Para quem é o cuidado?",
  "Qual serviço?",
  "Quando?",
  "Precisa de táxi dog?",
  "Confira e confirme",
] as const;

const STEP_FIELDS: Array<Array<FieldPath<BookingInput>>> = [
  ["petId"],
  ["servico"],
  ["data", "hora"],
  ["taxi", "cep", "numero", "complemento"],
  ["observacoes"],
];

type BookingWizardProps = {
  pets: WizardPet[];
  services: CatalogService[];
  today: string;
  /** Primeiro dia sugerido nos atalhos (amanhã, se hoje não há mais slots). */
  firstDay: string;
  initialPetId?: string;
  initialService?: string;
  /** Observações vindas do simulador de orçamento (pelagem longa e adicionais). */
  initialNotes?: string;
};

export function BookingWizard({
  pets,
  services,
  today,
  firstDay,
  initialPetId,
  initialService,
  initialNotes,
}: BookingWizardProps) {
  const [step, setStep] = useState(0);
  const [quote, setQuote] = useState<TaxiQuote | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const defaultValues: BookingInput = {
    petId: initialPetId ?? "",
    servico: initialService ?? "",
    data: "",
    hora: "",
    taxi: false,
    cep: "",
    numero: "",
    complemento: "",
    observacoes: initialNotes ?? "",
  };
// Validação só ao tentar avançar (trigger em goNext); o erro de um campo some assim que ele é editado.
  // Se a mensagem sumisse no blur, os botões abaixo pulariam de lugar no meio do clique e ele se perderia.
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { control, trigger, setError, handleSubmit, reset, formState } = form;

  const [petId, serviceSlug] = useWatch({ control, name: ["petId", "servico"] });
  const pet = pets.find((p) => p.id === petId);
  const service = services.find((s) => s.slug === serviceSlug);

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ name }) => {
          if (name) form.clearErrors(name as FieldPath<BookingInput>);
        },
      }),
    [form],
  );

  // Ao trocar de passo, o foco vai para o título: o leitor de tela anuncia onde a pessoa está.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (booking ? document.getElementById("agendamento-confirmado") : headingRef.current)?.focus();
  }, [step, booking]);

  async function goNext() {
    setServerError(null);
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) return;
    if (step === 3 && form.getValues("taxi") && !quote?.ok) {
      setError("cep", { message: "Calcule a taxa do táxi para continuar." }, { shouldFocus: true });
      return;
    }
    setStep((current) => Math.min(current + 1, BOOKING_STEPS.length - 1));
  }

  const confirm = handleSubmit(async (values) => {
    setServerError(null);
    const result = await createAppointmentAction(values);
    if (result.ok) {
      setBooking(result.booking);
      return;
    }
    setServerError(result.message);
    // Horário ocupado por outra pessoa: volta para a agenda já atualizada.
    if (result.field === "hora") {
      form.setValue("hora", "");
      setRefreshToken((token) => token + 1);
      setStep(2);
    }
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < BOOKING_STEPS.length - 1) void goNext();
    else void confirm();
  }

  function startOver() {
    reset({ ...defaultValues, petId: "", servico: "", observacoes: "" });
    setQuote(null);
    setBooking(null);
    setServerError(null);
    setStep(0);
  }

  if (booking) return <BookingSuccess booking={booking} onNew={startOver} />;

  const isLast = step === BOOKING_STEPS.length - 1;
  const canContinue = pets.length > 0;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <BookingProgress current={step} />

        <section aria-labelledby="passo-titulo" className="flex flex-col gap-5">
          <h2 id="passo-titulo" ref={headingRef} tabIndex={-1} className="text-2xl font-black outline-none">
            {STEP_TITLES[step]}
          </h2>

          <FormAlert message={serverError} />
          {formState.errors.petId && step === 0 && (
            <p className="text-sm font-semibold text-destructive">{formState.errors.petId.message}</p>
          )}
          {formState.errors.servico && step === 1 && (
            <p className="text-sm font-semibold text-destructive">{formState.errors.servico.message}</p>
          )}

          {step === 0 && <StepPet pets={pets} />}
          {step === 1 && pet && <StepService services={services} size={pet.size} />}
          {step === 2 && pet && service && (
            <StepDateTime today={today} firstDay={firstDay} servico={service.slug} size={pet.size} refreshToken={refreshToken} />
          )}
          {step === 3 && <StepTaxi quote={quote} onQuote={setQuote} />}
          {step === 4 && pet && service && <StepReview pet={pet} service={service} quote={quote} />}
        </section>

        {canContinue && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft aria-hidden="true" /> Voltar
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" size="lg" disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              {isLast ? (formState.isSubmitting ? "Confirmando..." : "Confirmar agendamento") : "Continuar"}
              {!isLast && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
