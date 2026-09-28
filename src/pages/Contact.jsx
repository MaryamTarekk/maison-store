import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: ["support@maison.com"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+20 100 000 0000"],
  },
  {
    icon: MapPin,
    title: "Our Location",
    details: ["Cairo, Egypt"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Saturday – Thursday", "10:00 AM – 8:00 PM"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo only: no message is sent to a real server.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const inputStyle = {
    backgroundColor: "var(--color-bg)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* Header */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="px-6 py-16 text-center md:py-20"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-sm uppercase tracking-[0.3em]"
          style={{ color: "var(--color-primary)" }}
        >
          We'd Love To Hear From You
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mb-5 text-4xl font-light md:text-6xl"
        >
          Contact Us
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-sm leading-7 md:text-base"
          style={{ color: "var(--color-muted)" }}
        >
          Have a question about your order or need help choosing the perfect
          piece? We're here for you.
        </motion.p>
      </motion.section>

      {/* Contact Content */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-3 text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--color-primary)" }}
          >
            Get In Touch
          </p>

          <h2 className="mb-6 text-3xl font-light md:text-4xl">Let's Talk</h2>

          <p
            className="mb-10 max-w-md text-sm leading-7"
            style={{ color: "var(--color-muted)" }}
          >
            Whether you have a question, feedback, or just want to say hello,
            send us a message and we'll be happy to help.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-7"
          >
            {contactInfo.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--color-border)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">{item.title}</h3>

                    {item.details.map((detail) => (
                      <p
                        key={detail}
                        className="text-sm leading-6"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 shadow-sm md:p-10"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[400px] flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle
                    size={56}
                    className="mb-5"
                    style={{ color: "var(--color-primary)" }}
                  />
                </motion.div>

                <h2 className="mb-4 text-2xl font-medium">Thank You!</h2>

                <p
                  className="mb-8 max-w-sm text-sm leading-7"
                  style={{ color: "var(--color-muted)" }}
                >
                  Your message has been received in this demo. No email has
                  actually been sent.
                </p>

                <motion.button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3 text-sm text-white transition"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-3 text-2xl font-light">Send Us a Message</h2>

                <p
                  className="mb-8 text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Fill out the form below and let us know how we can help.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm">Full Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Email Address</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Subject</label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is your message about?"
                      required
                      className="w-full border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Message</label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows={5}
                      required
                      className="w-full resize-none border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                      style={inputStyle}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full items-center justify-center gap-3 py-4 text-sm text-white transition"
                    style={{
                      backgroundColor: "var(--color-primary)",
                    }}
                  >
                    Send Message
                    <Send size={17} />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </motion.main>
  );
}
