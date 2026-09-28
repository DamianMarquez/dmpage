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
      className="experience-navigation"
    >
      {/* Izquierda */}
      <div className="experience-navigation-group">

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

      <div className="experience-navigation-help">

        <KeyboardIcon />

        <span>

          ← Anterior

        </span>

        <span>|</span>

        <span>

          Siguiente →

        </span>

      </div>

      {/* Derecha */}

      <div className="experience-navigation-group">

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
