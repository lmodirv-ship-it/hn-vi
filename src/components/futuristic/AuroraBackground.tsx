import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Mesh gradient base */}
      <div className="absolute inset-0 gradient-mesh opacity-90" />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-40 -right-32 h-[40rem] w-[40rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(239 84% 67% / 0.45), transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(260 80% 60% / 0.4), transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 right-1/4 h-[34rem] w-[34rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(168 76% 42% / 0.35), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/80" />
    </div>
  );
}