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
  const heading = useRef<HTMLHeadingElement>(null);
  const sending = useRef(false);
  const firstRender = useRef(true);
  const t = (en: string, german: string) => de ? german : en;
  const steps = [t("Contact", "Kontakt"), t("Transport", "Transport"), t("Confirmation", "Bestätigung")];
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus();
  }, [step, status === "sent"]);

  function go(next: number) { setStatus("idle"); setContactError(false); setStep(next); }
  function field(name: Field, label: string, type = "text", required = true, full = false, placeholder?: string) {
    return <label className={full ? "quote-full" : ""} key={name} htmlFor={name}>
      <span className="quote-label">{label}{required && <span aria-hidden="true"> *</span>}</span>
      <input id={name} name={name} type={type} required={required} value={data[name]} maxLength={300}
        autoComplete={name === "name" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : "off"}
        placeholder={placeholder} aria-describedby={name === "phone" || name === "email" ? "contact-help" : undefined}
        aria-invalid={(name === "phone" || name === "email") && contactError || undefined}
        onChange={event => { setData({ ...data, [name]: event.target.value }); setContactError(false); }} />
    </label>;
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (step === 0 && (!data.name.trim() || (!data.phone.trim() && !data.email.trim()))) {
      setContactError(true);
      document.getElementById(data.name.trim() ? "phone" : "name")?.focus();
      return;
    }
    if (step < 2) { go(step + 1); return; }
    sending.current = true;
    setStatus("sending");
    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "flexible") { if (value) body.set(key, "on"); }
      else body.set(key, String(value).trim());
    });
    try {
      const response = await fetch("/api/quote", { method: "POST", body, signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error("Delivery failed");
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
    </section> : <form className="quote-form" onSubmit={submit} aria-busy={status === "sending"}>
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
            <select id="running" value={data.running} onChange={e => setData({ ...data, running: e.target.value })}>
              <option value="">{t("Select one", "Auswählen")}</option><option value="Yes">{t("Yes", "Ja")}</option><option value="No">{t("No", "Nein")}</option><option value="Not sure">{t("Not sure", "Nicht sicher")}</option>
            </select>
          </label>
        </div>
        <label className="check-row"><input type="checkbox" checked={data.flexible} onChange={e => setData({ ...data, flexible: e.target.checked })} /><span>{t("My dates are flexible.", "Meine Termine sind flexibel.")}</span></label>
        <label htmlFor="details"><span className="quote-label">{t("Additional information (optional)", "Zusätzliche Angaben (optional)")}</span>
          <textarea id="details" rows={4} maxLength={3000} value={data.details} onChange={e => setData({ ...data, details: e.target.value })} aria-describedby="details-help" />
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
      {status === "error" && <p className="quote-error" role="alert">{t("We couldn’t confirm delivery. Your details are still here. Try again or contact us on ", "Der Versand konnte nicht bestätigt werden. Ihre Angaben bleiben erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns über ")}<a href="https://wa.me/40750402452">WhatsApp</a>.</p>}
      <div className="quote-actions">
        {step > 0 && <button className="quote-back" type="button" onClick={() => go(step - 1)} disabled={status === "sending"}>{t("Back", "Zurück")}</button>}
        <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? t("Sending…", "Wird gesendet…") : step === 2 ? t("Send enquiry", "Anfrage senden") : step === 1 ? t("Review enquiry", "Anfrage prüfen") : t("Continue to transport", "Weiter zum Transport")}</button>
      </div>
      <p className="form-footnote">{step === 2 ? t("Sending an enquiry does not reserve a collection date or confirm a booking.", "Eine Anfrage reserviert keinen Abholtermin und bestätigt keine Buchung.") : t("* Required fields.", "* Pflichtfelder.")}</p>
    </form>}
  </div>;
}
