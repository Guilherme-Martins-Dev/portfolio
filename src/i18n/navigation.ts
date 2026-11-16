import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Use sempre estes no lugar de next/link e next/navigation: eles conhecem o locale e as URLs traduzidas.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
