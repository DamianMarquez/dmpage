import {
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import { motion } from "framer-motion";

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  onFirst?: () => void;
  onLast?: () => void;

  disablePrevious: boolean;
  disableNext: boolean;

  primaryColor: string;
}

export default function Navigation({
  onPrevious,
  onNext,
  onFirst,
  onLast,
  disablePrevious,
  disableNext,
  primaryColor,
}: Props) {
  return (
    <motion.div
      layout
      className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8"
    >
      {/* Izquierda */}
      <div className="flex items-center gap-2">

        {onFirst && (
          <Tooltip title="Primer proyecto">
            <span>
              <IconButton
                onClick={onFirst}
                disabled={disablePrevious}
              >
                <KeyboardDoubleArrowLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Button
          variant="contained"
          startIcon={<ArrowBackIosNewIcon />}
          disabled={disablePrevious}
          onClick={onPrevious}
          sx={{
            backgroundColor: primaryColor,
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: .9,
            },
          }}
        >
          Anterior
        </Button>

      </div>

      {/* Centro */}

      <div className="hidden md:flex items-center gap-3 text-gray-500">

        <KeyboardIcon />

        <span className="text-sm">

          ← Anterior

        </span>

        <span>|</span>

        <span className="text-sm">

          Siguiente →

        </span>

      </div>

      {/* Derecha */}

      <div className="flex items-center gap-2">

        <Button
          variant="contained"
          endIcon={<ArrowForwardIosIcon />}
          disabled={disableNext}
          onClick={onNext}
          sx={{
            backgroundColor: primaryColor,
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: .9,
            },
          }}
        >
          Siguiente
        </Button>

        {onLast && (
          <Tooltip title="Último proyecto">
            <span>
              <IconButton
                onClick={onLast}
                disabled={disableNext}
              >
                <KeyboardDoubleArrowRightIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

      </div>

    </motion.div>
  );
}