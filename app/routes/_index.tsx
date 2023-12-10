import type { MetaFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {useMemo, useState} from "react";
import type {ColDef, ICellRendererParams} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";

export const loader = async() => {
  const data = await fetch("https://jsonplaceholder.typicode.com/users");
  const jsonData = await data.json();
  return json({ users: jsonData });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const NameRenderer = (params: ICellRendererParams & {onUserClick: (id: number) => void}) => {
  return (
      <span>
        <button onClick={() => params.onUserClick(params.data.id)}>{params.value}</button>
      </span>
  )
}

export default function Index() {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const userFetcher = useFetcher<any>();
  const {users} = useLoaderData<typeof loader>() || {};
  const onUserClick = (id: number) => {
    console.log('id', id)
    userFetcher.load(`/resources/getuser/${id}`, {unstable_flushSync: true})
  }
  const [columnDefs] = useState<ColDef[]>([
    { headerName: 'Name', field: 'name', cellRenderer: (params: ICellRendererParams) => <NameRenderer {...params} onUserClick={onUserClick} /> },
    { field: 'Username' },
    { field: 'email' },
    { field: 'website' },
  ]);

  console.log('userFetcher', userFetcher)


  return (
      <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
        <h1>Welcome to Remix</h1>
        <ul>
          <li>
            <a
                target="_blank"
                href="https://remix.run/tutorials/blog"
                rel="noreferrer"
            >
              15m Quickstart Blog Tutorial
            </a>
          </li>
          <li>
            <a
                target="_blank"
                href="https://remix.run/tutorials/jokes"
                rel="noreferrer"
            >
              Deep Dive Jokes App Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
        </ul>

        <div style={containerStyle}>
          <div
              style={gridStyle}
              className={
                "ag-theme-quartz"
              }
          >
              <p>
                Clicked User: {userFetcher.data?.name}
              </p>
            <AgGridReact
                rowData={users}
                columnDefs={columnDefs}
                domLayout='autoHeight'
            />
          </div>
        </div>
      </div>
  );
}
