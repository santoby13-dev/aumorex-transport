"use client";

import { useEffect, useRef, useState } from "react";
import "./quote-form.css";

const empty = { name: "", phone: "", email: "", vehicle: "", collection: "", delivery: "", date: "", running: "", details: "", flexible: false };
type Field = Exclude<keyof typeof empty, "flexible">;

export default function QuoteForm({ de }: { de: boolean }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const sending = useRef(false);
  const firstRender = useRef(true);
  const t = (en: string, german: string) => de ? german : en;
  const steps = [t("Contact", "Kontakt"), t("Transport", "Transport"), t("Confirmation", "Bestätigung")];
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus();
  }, [step, status === "sent"]);

  function go(next: number) { setStatus("idle"); setContactError(false); setFieldErrors({}); setSubmitError(""); setShowWhatsAppFallback(false); setStep(next); }
  function field(name: Field, label: string, type = "text", required = true, full = false, placeholder?: string) {
    const errorId = `${name}-error`;
    const helpId = name === "phone" || name === "email" ? "contact-help" : undefined;
    const describedBy = [helpId, fieldErrors[name] ? errorId : undefined].filter(Boolean).join(" ") || undefined;
    return <label className={full ? "quote-full" : ""} key={name} htmlFor={name}>
      <span className="quote-label">{label}{required && <span aria-hidden="true"> *</span>}</span>
      <input id={name} name={name} type={type} required={required} value={data[name]} maxLength={300}
        autoComplete={name === "name" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : "off"}
        placeholder={placeholder} aria-describedby={describedBy}
        aria-invalid={fieldErrors[name] ? true : undefined}
        onChange={event => { setData(current => ({ ...current, [name]: event.target.value })); setContactError(false); setFieldErrors(errors => ({ ...errors, [name]: undefined })); setSubmitError(""); }} />
      {fieldErrors[name] && <span id={errorId} className="field-error">{fieldErrors[name]}</span>}
    </label>;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const errors: Partial<Record<Field, string>> = {};
    if (step === 0) {
      if (!data.name.trim()) errors.name = t("Enter your name.", "Geben Sie Ihren Namen ein.");
      if (!data.phone.trim() && !data.email.trim()) {
        errors.phone = t("Add a phone number or email address.", "Geben Sie eine Telefonnummer oder E-Mail-Adresse an.");
        errors.email = errors.phone;
      } else if (data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
        errors.email = t("Enter a valid email address.", "Geben Sie eine gültige E-Mail-Adresse ein.");
      }
    }
    if (step === 1) {
      const required: [Field, string][] = [["vehicle", t("Add the vehicle details.", "Geben Sie die Fahrzeugdaten ein.")], ["collection", t("Add a collection location.", "Geben Sie einen Abholort ein.")], ["delivery", t("Add a delivery location.", "Geben Sie einen Lieferort ein.")], ["date", t("Choose a preferred collection date.", "Wählen Sie einen Wunschtermin.")]];
      required.forEach(([name, message]) => { if (!data[name].trim()) errors[name] = message; });
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setContactError(step === 0 && Boolean(errors.phone || errors.email));
      const firstInvalid = Object.keys(errors)[0] as Field;
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    if (step < 2) { go(step + 1); return; }
    sending.current = true;
    setStatus("sending");
    setSubmitError("");
    setShowWhatsAppFallback(false);
    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "flexible") { if (value) body.set(key, "on"); }
      else body.set(key, String(value).trim());
    });
    try {
      const response = await fetch("/api/quote", { method: "POST", body, signal: AbortSignal.timeout(20000) });
      if (!response.ok) {
        if (response.status === 400) setSubmitError(t("Please check the highlighted details and try again.", "Bitte prüfen Sie die markierten Angaben und versuchen Sie es erneut."));
        else { setSubmitError(t("We couldn’t send your enquiry right now. Your details are still here. Try again or contact us on WhatsApp.", "Ihre Anfrage konnte gerade nicht gesendet werden. Ihre Angaben bleiben erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.")); setShowWhatsAppFallback(true); }
        throw new Error("Quote request failed");
      }
      setStatus("sent");
    } catch { setStatus("error"); }
    finally { sending.current = false; }
  }
  const labels: [Field, string][] = [
    ["name", t("Contact name", "Kontaktname")], ["phone", t("Phone number", "Telefonnummer")], ["email", "Email"],
    ["vehicle", t("Make, model and year", "Marke, Modell und Baujahr")],
    ["collection", t("Collection location", "Abholort")], ["delivery", t("Delivery location", "Lieferort")],
    ["date", t("Preferred collection date", "Wunschtermin")], ["running", t("Does the vehicle run?", "Fahrzeug fahrbereit?")],
    ["details", t("Additional information", "Zusätzliche Angaben")]
  ];
  const runningLabel = data.running === "Yes" ? t("Yes", "Ja") : data.running === "No" ? t("No", "Nein") : data.running === "Not sure" ? t("Not sure", "Nicht sicher") : "—";

  return <div className="quote-wizard" lang={de ? "de" : "en"}>
    <ol className="quote-steps" aria-label={t("Quote request progress", "Fortschritt der Anfrage")}>
      {steps.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-complete={index < step}>
        <span>{index + 1}</span>{label}
      </li>)}
    </ol>
    {status === "sent" ? <section className="quote-success">
      <h2 ref={heading} tabIndex={-1}>{t("Thank you. Your enquiry has been sent.", "Vielen Dank. Ihre Anfrage wurde gesendet.")}</h2>
      <p>{t("We’ll get back to you within 3 hours to discuss your transport requirements.", "Wir melden uns innerhalb von 3 Stunden, um Ihren Transport zu besprechen.")}</p>
      <p>{t("This is an enquiry, not a confirmed booking.", "Dies ist eine Anfrage, keine bestätigte Buchung.")}</p>
      <a className="text-link" href={de ? "/de" : "/"}>{t("Back to home", "Zur Startseite")}</a>
    </section> : <form className="quote-form" noValidate onSubmit={submit} aria-busy={status === "sending"}>
      <h2 ref={heading} tabIndex={-1}>{step === 0 ? t("How can we reach you?", "Wie erreichen wir Sie?") : step === 1 ? t("What needs moving?", "Was soll transportiert werden?") : t("Check your enquiry.", "Prüfen Sie Ihre Anfrage.")}</h2>
      <p className="quote-step-help">{step === 0 ? t("Start with your name and a way to contact you.", "Beginnen Sie mit Ihrem Namen und einer Kontaktmöglichkeit.") : step === 1 ? t("Tell us about the vehicle, route and preferred date.", "Nennen Sie uns Fahrzeug, Strecke und Wunschtermin.") : t("Review your details before sending. You can still make changes.", "Prüfen Sie Ihre Angaben vor dem Senden. Änderungen sind noch möglich.")}</p>
      {step === 0 && <>
        <div className="form-grid">
          {field("name", t("Contact name", "Kontaktname"), "text", true, true)}
          {field("phone", t("Phone number", "Telefonnummer"), "tel", false)}
          {field("email", "Email", "email", false)}
        </div>
        <p id="contact-help" className={contactError ? "quote-error" : "quote-help"} role={contactError ? "alert" : undefined}>
          {t("Provide a phone number or email address — either one is enough.", "Telefonnummer oder E-Mail-Adresse angeben — eine Angabe genügt.")}
        </p>
      </>}
      {step === 1 && <>
        <div className="form-grid">
          {field("vehicle", t("Vehicle make, model and year", "Fahrzeugmarke, Modell und Baujahr"), "text", true, true, t("e.g. BMW 320d, 2021", "z. B. BMW 320d, 2021"))}
          {field("collection", t("Collection location", "Abholort"), "text", true, false, t("Town / city and country", "Ort und Land"))}
          {field("delivery", t("Delivery location", "Lieferort"), "text", true, false, t("Town / city and country", "Ort und Land"))}
          {field("date", t("Preferred collection date", "Wunschtermin"), "date")}
          <label htmlFor="running"><span className="quote-label">{t("Does the vehicle run?", "Fahrzeug fahrbereit?")}</span>
            <select id="running" value={data.running} onChange={e => setData(current => ({ ...current, running: e.target.value }))}>
               <option value="">{t("Select one", "Auswählen")}</option><option value="Yes">{t("Yes", "Ja")}</option><option value="No">{t("No", "Nein")}</option><option value="Not sure">{t("Not sure", "Nicht sicher")}</option>
            </select>
          </label>
        </div>
        <label className="check-row"><input type="checkbox" checked={data.flexible} onChange={e => setData(current => ({ ...current, flexible: e.target.checked }))} /><span>{t("My dates are flexible.", "Meine Termine sind flexibel.")}</span></label>
        <label htmlFor="details"><span className="quote-label">{t("Additional information (optional)", "Zusätzliche Angaben (optional)")}</span>
          <textarea id="details" rows={4} maxLength={3000} value={data.details} onChange={e => setData(current => ({ ...current, details: e.target.value }))} aria-describedby="details-help" />
        </label>
        <p id="details-help" className="quote-help">{t("For example: company, approximate weight or special requirements.", "Zum Beispiel: Unternehmen, ungefähres Gewicht oder besondere Anforderungen.")}</p>
      </>}
      {step === 2 && <div className="quote-review">
        {[0, 1].map(group => <section key={group}>
          <div className="quote-review-heading"><h3>{steps[group]}</h3><button type="button" disabled={status === "sending"} onClick={() => go(group)}>{t("Edit", "Bearbeiten")} {steps[group].toLowerCase()}</button></div>
          <dl>{labels.slice(group === 0 ? 0 : 3, group === 0 ? 3 : undefined).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{key === "running" ? runningLabel : data[key].trim() || "—"}</dd></div>)}
            {group === 1 && <div><dt>{t("Flexible dates", "Flexible Termine")}</dt><dd>{data.flexible ? t("Yes", "Ja") : t("No", "Nein")}</dd></div>}
          </dl>
        </section>)}
      </div>}
       {status === "error" && <p className="quote-error" role="alert">{submitError || t("We couldn’t send your enquiry. Your details are still here. Try again or contact us on WhatsApp.", "Ihre Anfrage konnte nicht gesendet werden. Ihre Angaben bleiben erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.")} {showWhatsAppFallback && <a href="https://wa.me/40750402452">WhatsApp</a>}</p>}
      <div className="quote-actions">
        {step > 0 && <button className="quote-back" type="button" onClick={() => go(step - 1)} disabled={status === "sending"}>{t("Back", "Zurück")}</button>}
        <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? t("Sending…", "Wird gesendet…") : step === 2 ? t("Send enquiry", "Anfrage senden") : step === 1 ? t("Review enquiry", "Anfrage prüfen") : t("Continue to transport", "Weiter zum Transport")}</button>
      </div>
      <p className="form-footnote">{step === 2 ? t("Sending an enquiry does not reserve a collection date or confirm a booking.", "Eine Anfrage reserviert keinen Abholtermin und bestätigt keine Buchung.") : t("* Required fields.", "* Pflichtfelder.")}</p>
    </form>}
  </div>;
}
