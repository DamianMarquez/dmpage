import { useCallback, useEffect, useMemo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type{ Company } from "./types";

interface UseExperienceProps {
    companies: Company[];
}

export default function useExperience({
    companies,
}: UseExperienceProps) {

    const [companyIndex, setCompanyIndex] = useState(0);
    const [projectIndex, setProjectIndex] = useState(0);

    const company = companies[companyIndex];

    const project = company.projects[projectIndex];

    /**
     * Total de proyectos
     */
    const totalProjects = useMemo(() => {
        return companies.reduce(
            (acc, company) => acc + company.projects.length,
            0
        );
    }, [companies]);

    /**
     * Proyecto global
     */
    const globalProjectIndex = useMemo(() => {

        let total = 0;

        for (let i = 0; i < companyIndex; i++) {
            total += companies[i].projects.length;
        }

        total += projectIndex + 1;

        return total;

    }, [
        companies,
        companyIndex,
        projectIndex
    ]);

    /**
     * Avanzar
     */
    const next = useCallback(() => {

        if (projectIndex < company.projects.length - 1) {
            setProjectIndex(p => p + 1);
            return;
        }

        if (companyIndex < companies.length - 1) {
            setCompanyIndex(c => c + 1);
            setProjectIndex(0);
        }

    }, [
        company,
        companies,
        companyIndex,
        projectIndex
    ]);

    /**
     * Retroceder
     */
    const previous = useCallback(() => {

        if (projectIndex > 0) {
            setProjectIndex(p => p - 1);
            return;
        }

        if (companyIndex > 0) {

            const previousCompany =
                companies[companyIndex - 1];

            setCompanyIndex(c => c - 1);

            setProjectIndex(
                previousCompany.projects.length - 1
            );

        }

    }, [
        companyIndex,
        projectIndex,
        companies
    ]);

    /**
     * Ir a una empresa
     */
    const goToCompany = useCallback((index: number) => {

        if (index < 0) return;

        if (index >= companies.length) return;

        setCompanyIndex(index);

        setProjectIndex(0);

    }, [companies]);

    /**
     * Ir a un proyecto
     */
    const goToProject = useCallback((index: number) => {

        if (index < 0) return;

        if (index >= company.projects.length) return;

        setProjectIndex(index);

    }, [company]);

    /**
     * Swipe Mobile
     */
    const swipeHandlers = useSwipeable({

        onSwipedLeft() {
            next();
        },

        onSwipedRight() {
            previous();
        },

        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: false

    });

    /**
     * Flechas teclado
     */
    useEffect(() => {

        const handler = (event: KeyboardEvent) => {

            switch (event.key) {

                case "ArrowLeft":
                    previous();
                    break;

                case "ArrowRight":
                    next();
                    break;

            }

        };

        window.addEventListener(
            "keydown",
            handler
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handler
            );

    }, [next, previous]);

const first = () => {
    setCompanyIndex(0);
    setProjectIndex(0);
};

const last = () => {

    const lastCompany =
        companies[companies.length - 1];

    setCompanyIndex(companies.length - 1);

    setProjectIndex(
        lastCompany.projects.length - 1
    );

};

    return {

        company,

        project,

        companyIndex,

        projectIndex,

        totalProjects,

        globalProjectIndex,

        next,

        previous,

        goToCompany,

        goToProject,

        swipeHandlers,first,
last

    };

 

}
