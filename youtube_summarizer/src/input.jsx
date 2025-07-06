import { useState } from "react";

export function input({onSubmit,loading}){
    const [url, setURL] = useState("");
    return(
        <form onSubmit={
            e=>{
                e.preventDefault();
                onSubmit(url);
            }
        }>
            <input type="text" value={url} placeholder="Paste video URL" onChange={e=>setURL(e.target.value)}/>
        </form>
    )
}

export default input;