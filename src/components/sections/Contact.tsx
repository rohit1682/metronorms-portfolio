import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RiInstagramLine } from 'react-icons/ri';
import { CONTACT, BRAND, CLOSING } from '../../constants';
import { CONTACT_UI } from '../../constants/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BAND_EMAIL = 'metronorms23@gmail.com';

// ── Contact form (mailto) ─────────────────────────────────────────────────────
function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [mailtoUrl, setMailtoUrl] = useState('');

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = 'Your email is required';
    else if (!EMAIL_RE.test(email.trim())) errs.email = 'Enter a valid email address';
    if (!message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const body = encodeURIComponent(`From: ${email.trim()}\n\n${message.trim()}`);
    setMailtoUrl(`mailto:${BAND_EMAIL}?subject=Booking%20Enquiry&body=${body}`);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(139,0,0,0.35)',
    borderRadius: '3px',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.88rem',
    letterSpacing: '0.03em',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const errorStyle: React.CSSProperties = {
    color: 'var(--crimson)',
    fontSize: '0.72rem',
    letterSpacing: '0.05em',
    marginTop: '5px',
    textAlign: 'left',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.65rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--white-muted)',
    marginBottom: '7px',
    textAlign: 'left',
  };

  // After the form is submitted — show a ready-to-click mailto link (works on all platforms)
  if (mailtoUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          padding: '28px 24px',
          background: 'rgba(139,0,0,0.1)',
          border: '1px solid rgba(196,30,58,0.4)',
          borderRadius: '4px',
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          letterSpacing: '0.1em',
          color: 'var(--white)',
          marginBottom: '16px',
        }}>
          Message ready — send it now
        </div>

        {/* Primary CTA — works on desktop & mobile */}
        <a
          href={mailtoUrl}
          style={{
            display: 'inline-block',
            padding: '13px 36px',
            background: 'linear-gradient(135deg, var(--dark-red), var(--crimson))',
            borderRadius: '2px',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(196,30,58,0.35)',
            marginBottom: '16px',
          }}
        >
          Open in Email App →
        </a>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          color: 'var(--white-muted)',
          letterSpacing: '0.04em',
          marginTop: '8px',
        }}>
          No email app? Write to us directly:{' '}
          <a
            href={`mailto:${BAND_EMAIL}`}
            style={{ color: 'var(--crimson)', textDecoration: 'none', fontWeight: 600 }}
          >
            {BAND_EMAIL}
          </a>
        </p>

        <button
          onClick={() => setMailtoUrl('')}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--white-muted)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ← Edit message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '40px',
        textAlign: 'left',
      }}
    >
      {/* Email field */}
      <div>
        <label htmlFor="sender-email" style={labelStyle}>Your Email *</label>
        <input
          id="sender-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
          placeholder="you@example.com"
          style={{
            ...inputStyle,
            borderColor: errors.email ? 'var(--crimson)' : 'rgba(139,0,0,0.35)',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,30,58,0.75)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(196,30,58,0.18)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = errors.email ? 'var(--crimson)' : 'rgba(139,0,0,0.35)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="sender-message" style={labelStyle}>Message *</label>
        <textarea
          id="sender-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: undefined })); }}
          placeholder="Tell us about your event, date, venue, and any special requirements…"
          rows={5}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '100px',
            borderColor: errors.message ? 'var(--crimson)' : 'rgba(139,0,0,0.35)',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,30,58,0.75)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(196,30,58,0.18)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = errors.message ? 'var(--crimson)' : 'rgba(139,0,0,0.35)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        />
        {errors.message && <p style={errorStyle}>{errors.message}</p>}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          alignSelf: 'flex-start',
          padding: '13px 36px',
          background: 'linear-gradient(135deg, var(--dark-red), var(--crimson))',
          border: 'none',
          borderRadius: '2px',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(196,30,58,0.35)',
        }}
      >
        Send Message →
      </motion.button>

      <p style={{
        fontSize: '0.68rem',
        color: 'var(--white-muted)',
        letterSpacing: '0.04em',
        marginTop: '-8px',
      }}>
        Prepares an email to{' '}
        <span style={{ color: 'var(--white-dim)' }}>{BAND_EMAIL}</span>
        {' '}— you'll click to send from your email app
      </p>
    </motion.form>
  );
}

// ── Main Contact section ──────────────────────────────────────────────────────
export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        borderTop: '1px solid rgba(139,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(139,0,0,0.4), transparent)',
      }} />

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
      }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Label */}
          <motion.div
            variants={itemVariants}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--crimson)',
              marginBottom: '16px',
            }}
          >
            {CONTACT_UI.sectionNumber} / {CONTACT.heading}
          </motion.div>

          {/* Heading */}
          <motion.h2 variants={itemVariants} className="section-heading" style={{ marginBottom: '8px' }}>
            {CONTACT_UI.displayHeading}
          </motion.h2>

          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="red-divider" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: 'var(--font-italic)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              color: 'var(--white-dim)',
              lineHeight: 1.7,
              marginTop: '16px',
              marginBottom: '40px',
            }}
          >
            {CONTACT_UI.subheading}
          </motion.p>

          {/* Email form */}
          <motion.div variants={itemVariants}>
            <ContactForm />
          </motion.div>

          {/* Contact cards */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {CONTACT.phones.map((phone) => (
              <motion.a
                key={phone.number}
                href={`tel:${phone.number.replace(/\s/g, '')}`}
                whileHover={{ scale: 1.03, borderColor: 'rgba(196,30,58,0.7)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'block',
                  padding: '20px',
                  background: 'rgba(139,0,0,0.08)',
                  border: '1px solid rgba(139,0,0,0.3)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--crimson)',
                  marginBottom: '8px',
                }}>
                  {phone.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.05em',
                  color: 'var(--white)',
                }}>
                  {phone.number}
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Instagram */}
          <motion.a
            variants={itemVariants}
            href={`https://instagram.com/${CONTACT.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(196,30,58,0.55)',
              color: 'var(--white)',
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: 'clamp(11px, 2vw, 14px) clamp(20px, 4vw, 32px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              color: 'var(--white-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              marginBottom: '48px',
            }}
          >
            {/* Instagram logo — gradient coloured to match the brand */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#fff',
              flexShrink: 0,
            }}>
              <RiInstagramLine size={16} />
            </span>
            @{CONTACT.instagram}
          </motion.a>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(139,0,0,0.4), transparent)',
              marginBottom: '40px',
            }}
          />

          {/* Thank you + band name */}
          <motion.div variants={itemVariants}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.06)',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              {CLOSING.message}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              letterSpacing: '0.2em',
              color: 'var(--crimson)',
            }}>
              — {BRAND.name}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--white-muted)',
              letterSpacing: '0.1em',
              marginTop: '8px',
            }}>
              {BRAND.instagram}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
