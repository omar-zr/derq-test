import { useQuery } from "@tanstack/react-query";
import { GeneratorService } from "../client";

export function useGeneratorStatus() {
    return useQuery({
        queryFn: () => GeneratorService.getStatus(),
        queryKey: ["generatorStatus"],
    });
}
