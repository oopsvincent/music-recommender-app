// Waveform component (drop this ABOVE return)
const Waveform = () => (
  <div className="flex items-end justify-center gap-1 h-8 my-2">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ height: isPaused ? 8 : [8, 24, 8] }}
        transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white rounded"
        style={{ width: 4, borderRadius: '4px', backgroundColor: '#ffffffcc', minWidth: 4 }}
      />
    ))}
  </div>
);

export default Waveform;