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
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-gray-700"
        >
          Proyecto {current} de {total}
        </motion.span>

        <span className="text-xs text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 10,
          backgroundColor: "#E5E7EB",
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