//WRITE BY 2012492343@qq.com


function sleep(time) {
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
}

async function fetchFollowings(pn) {
    let vmid =301807432,ps=50;
    let urls ="https://api.bilibili.com/x/relation/followings" + `?vmid=${vmid}&ps=${ps}&pn=${pn}`;  
    try{
        let res = await fetch(
            urls, {
            methods: 'get', credentials: 'include',
            headers: {},
            mode: 'cors',
            cache: 'default'
        })
            .then(res => {
                return res.json();
            })
            .then(json => {
                console.log(json);
                if (pn == 0) {
                    let loops =Math.ceil(json.data.total / 50)
                    return loops;
                } else {
                    return json.data;
                }

            })
            .catch(err => {
                return console.log(err);
            });
        return res;
    }catch (err) {
        return err;
    }
}

async function fetchAllFollowings() {
   let followings = [];
    var loops =await fetchFollowings(0);
    let pn =1;
    while(pn!=loops){ //ps!=0
        sleep(2000);
        pn+=1;
        let data = await fetchFollowings(pn);
        followings.push(...data.list);
    };
    console.log('已完成');
    return followings;
}

async function main() {
    let data = await this.fetchAllFollowings();
    let blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
    let aLink = document.createElement('a');
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('download', '【bilibili】关注的人.json');
    aLink.style.cssText = "border:1px solid #ccc;position:absolute; _position:absolute; left: 1rem; top: 6rem; padding:.1rem;";
    aLink.innerHTML = '下载';
    document.body.appendChild(aLink);
}

main();
