import { useState } from "react";

export function Input({onSubmit,loading}){
    const [url, setURL] = useState("");
    return(
        <form onSubmit={
            e=>{
                e.preventDefault();
                onSubmit(url);
            }
        }>
            <input type="text" value={url} placeholder="Paste video URL" onChange={e=>setURL(e.target.value)}/>
            <button type="submit" disabled={loading || !url} style={{ display: "none" }}>
                Go
            </button>
        </form>
    )
}

export default Input;