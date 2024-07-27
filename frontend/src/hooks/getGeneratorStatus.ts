import { GeneratorService } from "../client/services";

export function getStatus() {
    return {
        queryFn: () => GeneratorService.getStatus(),
        queryKey: ["generatorStatus"],
    };
}
