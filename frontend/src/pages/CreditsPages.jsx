// src/pages/CreditsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function CreditsPage() {
      window.scrollTo(0, 0)
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 space-grotesk"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        Credits & Acknowledgements
      </h1>

      <p className="text-gray-400 text-md text-center max-w-2xl mb-10">
        This application was meticulously crafted with passion, dedication, and teamwork. We acknowledge the remarkable individuals who contributed to its success.
      </p>

      <div className="w-full max-w-2xl space-y-6 text-sm md:text-base">
        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-green-400 mb-1">Lead Developer & Designer</h2>
          <p><span className="font-semibold text-white">Farhan Ali rReza</span> — Frontend, UI/UX, partial backend, project vision & architecture.</p>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-blue-400 mb-1">Backend Development</h2>
          <p><span className="font-semibold text-white">Soumodip Mondal</span> — Core backend systems, authentication, and API integrations.</p>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-purple-400 mb-1">Database Engineering</h2>
          <p><span className="font-semibold text-white">Soumodip Mondal & Dhiraj Patra</span> — Database schema, optimization, and management.</p>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-pink-400 mb-1">Data Collection & Research</h2>
          <p><span className="font-semibold text-white">Yeasir Maruf Mollah & Mouktick Manna</span> — Data gathering, surveys, and dataset preparation.</p>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-yellow-400 mb-1">Presentations & Documentation</h2>
          <p><span className="font-semibold text-white">Moucktick Manna & Team</span> — Project reports, slides, and demonstrations.</p>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h2 className="text-xl font-semibold text-gray-400 mb-1">Special Thanks</h2>
          <p>To all testers, supporters, mentors, and the developer community who inspired and guided us throughout this journey. We extend heartfelt thanks to all the anonymous participants who contributed their time and insights to our surveys and research. Your input was invaluable in shaping this app.</p>
        </section>
      </div>

      <p className="text-xs text-gray-500 mt-12 text-center max-w-md">
        © 2025 The CodeBreakers. This app is licensed under the MIT License. All trademarks and logos are property of their respective owners.
      </p>
    </motion.div>
  );
}
