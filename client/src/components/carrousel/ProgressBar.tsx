import { LinearProgress } from "@mui/material";
import { motion } from "framer-motion";

interface Props {
  current: number;
  total: number;
  primaryColor: string;
}

export default function ProgressBar({
  current,
  total,
  primaryColor,
}: Props) {
  const percentage = (current / total) * 100;

  return (
    <div className="experience-progress">
      <div className="experience-progress-header">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="experience-progress-label"
        >
          Proyecto {current} de {total}
        </motion.span>

        <span className="experience-progress-value">
          {Math.round(percentage)}%
        </span>
      </div>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: primaryColor,
            borderRadius: 10,
            transition: "transform .4s ease",
          },
        }}
      />
    </div>
  );
}
