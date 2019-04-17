# 最短路(road)
[BZOJ3040]


N个点，M条边的有向图，求点1到点N的最短路（保证存在）。  
1<=N<=1000000，1<=M<=10000000

配对堆维护 Dij 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=1000100;
const int maxM=10000001;

int n,m;
int ecnt=-1,Hd[maxN],Nt[maxM],V[maxM],W[maxM];
int rt=1,Fa[maxN];ll Dst[maxN];
int hcnt=1,Hf[maxN],Hv[maxN],Hnxt[maxN],Hpre[maxN],Hfa[maxN],top,Ryc[maxN];

void Add_Edge(int u,int v,int w);
int Merge(int u,int v);
void Pop();
void Decrease(int u,ll key);
void Recycle(int id);
int New();
int main(){
    scanf("%d%d",&n,&m);memset(Hd,-1,sizeof(Hd));memset(Hf,-1,sizeof(Hf));
    int T,rxa,rxb,rya,ryb,rp;scanf("%d%d%d%d%d%d",&T,&rxa,&rxb,&rya,&ryb,&rp);
    for (int i=1,x=0,y=0,a,b;i<=T;i++){
        x=(1ll*x*rxa%rp+rxb)%rp;y=(1ll*y*rya%rp+ryb)%rp;
        a=min(x%n+1,y%n+1);b=max(x%n+1,y%n+1);
        Add_Edge(a,b,100000000-100*a);
    }
    for (int i=T+1;i<=m;i++){
        int u,v,w;scanf("%d%d%d",&u,&v,&w);
        Add_Edge(u,v,w);
    }
    memset(Dst,127,sizeof(Dst));Dst[1]=0;
    for (int i=2;i<=n;i++) rt=Merge(rt,i);
    for (int k=1;k<n;k++){
        int u=rt;Pop();
        for (int i=Hd[u];i!=-1;i=Nt[i]) if (Dst[V[i]]>Dst[u]+W[i]) Decrease(V[i],Dst[u]+W[i]);
    }
    printf("%lld\n",Dst[n]);return 0;
}
void Add_Edge(int u,int v,int w){
    Nt[++ecnt]=Hd[u];Hd[u]=ecnt;V[ecnt]=v;W[ecnt]=w;return;
}
int Merge(int u,int v){
    if (!u||!v) return u+v;
    if (u==v) return u;
    if (Dst[u]>Dst[v]) swap(u,v);
    
    if (Hfa[v]){
        int pre=Hpre[Hfa[v]],nxt=Hnxt[Hfa[v]];
        if (Hf[Fa[v]]==Hfa[v]) Hf[Fa[v]]=Hpre[Hf[Fa[v]]];
        if (pre!=-1) Hnxt[pre]=nxt;
        if (nxt!=-1) Hpre[nxt]=pre;
        Recycle(Hfa[v]);
    }
    Hfa[v]=Fa[v]=0;
    
    int id=New();Hv[id]=v;Hfa[v]=id;Fa[v]=u;
    if (Hf[u]!=-1) Hnxt[Hf[u]]=id;
    Hpre[id]=Hf[u];Hf[u]=id;Hnxt[id]=-1;
    return u;
}
void Pop(){
    static int scnt[2],Seq[2][maxN];
    scnt[0]=0;
    for (int i=Hf[rt];i!=-1;i=Hpre[i]){
        if (Fa[Hv[i]]==rt) Seq[0][++scnt[0]]=Hv[i],Hfa[Hv[i]]=Fa[Hv[i]]=0;
        Recycle(i);
    }
    int opt=0;Hf[rt]=-1;
    while (scnt[opt]>1){
        opt^=1;scnt[opt]=0;
        for (int i=1;i+1<=scnt[opt^1];i+=2) Seq[opt][++scnt[opt]]=Merge(Seq[opt^1][i],Seq[opt^1][i+1]);
        if (scnt[opt^1]&1) Seq[opt][++scnt[opt]]=Seq[opt^1][scnt[opt^1]];
    }
    rt=Seq[opt][1];return;
}
void Decrease(int u,ll key){
    if (Hfa[u]){
        int pre=Hpre[Hfa[u]],nxt=Hnxt[Hfa[u]];
        if (Hf[Fa[u]]==Hfa[u]) Hf[Fa[u]]=Hpre[Hf[Fa[u]]];
        if (pre!=-1) Hnxt[pre]=nxt;
        if (nxt!=-1) Hpre[nxt]=pre;
        Recycle(Hfa[u]);
    }
    Fa[u]=0;Hfa[u]=0;
    Dst[u]=key;rt=Merge(rt,u);return;
}
void Recycle(int id){
    Ryc[++top]=id;return;
}
int New(){
    if (top) return Ryc[top--];
    return ++hcnt;
}
```