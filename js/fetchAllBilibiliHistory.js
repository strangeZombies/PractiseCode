//WRITE BY 2012492343@qq.com

async function fetchHistory(max,view_at,business){
    try{
        let urls="https://api.bilibili.com/x/web-interface/history/cursor"+`?max=${max}&view_at=${view_at}&business=${business}`;
        let res= await fetch(
            urls,{
            methods:'get', credentials: 'include',
            headers:{},
            mode:'cors',
            cache:'default'})
            .then(res=>res.json())
            .then(json=>{
                return json.data;
            }
            )
            .catch(err=>console.log(err));
        return res;
    }catch(err){
        return err;
    }
}

async function FetchAllHistory(self) {
    let histories=[], max=0,view_at = 0,business = '', ps = 20;
    let ii =2;
    while(ps!=0){ //ps!=0
        ii++;
        let data = await fetchHistory(max,view_at,business);
        max = data.cursor.max;
        view_at = data.cursor.view_at;
        business = data.cursor.business;
        histories.push(...data.list);
        ps = data.cursor.ps;
        
    };
    return histories;
}
async function main() {
    let data = await this.FetchAllHistory();
    let blob = new  Blob([JSON.stringify(data)], {type: 'text/json'});
    let aLink = document.createElement('a');
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('download', '【bilibili】历史记录.json');
    aLink.style.cssText="border:1px solid #ccc;position:absolute; _position:absolute; left: 1rem; top: 6rem; padding:.1rem;";
    aLink.innerHTML = '下载';
    document.body.appendChild(aLink);
}

main();

