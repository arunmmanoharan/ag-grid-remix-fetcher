import type { LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";

export const loader = async({params}: LoaderFunctionArgs) => {
    const {userid} = params;
    const fetchData = await fetch(`https://jsonplaceholder.typicode.com/users/${userid}`);
    const fetchJson = await fetchData.json();
    return json(fetchJson);
}
