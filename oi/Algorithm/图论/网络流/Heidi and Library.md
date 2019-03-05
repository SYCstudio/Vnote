# Heidi and Library
[CF802C]

The good times at Heidi's library are over. Marmots finally got their internet connections and stopped coming to the library altogether. Not only that, but the bookstore has begun charging extortionate prices for some books. Namely, whereas in the previous versions each book could be bought for 1 CHF, now the price of book i is ci CHF.

对每一天拆点，之间连 -inf 的边保证每个都要走到。然后天之间连边，如果书的类型相同则费用为 0 ，否则为购置新书的代价。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxN=100*2;
const int maxM=maxN*maxN;
const int inf=1e8;

class Edge{
    public:
    int v,flow;
    ll w;
};

int n,K,m,S,T,Seq[maxN],Cst[maxN];
int ecnt=-1,Hd[maxN],Nt[maxM];
Edge E[maxM];
int Qu[maxN],inq[maxN],Flow[maxN],Path[maxN];
ll Dst[maxN];

void Add_Edge(int u,int v,int flow,ll w);
bool Spfa();
int main(){
    scanf("%d%d",&n,&K);memset(Hd,-1,sizeof(Hd));
    for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);for (int i=1;i<=n;i++) scanf("%d",&Cst[i]);
    int nS=n+n+2;S=n+n+1;T=n+n+3;Add_Edge(S,nS,K,0);
    for (int i=1;i<=n;i++) Add_Edge(nS,i,1,Cst[Seq[i]]),Add_Edge(i,i+n,1,-inf),Add_Edge(i+n,T,1,0);
    for (int i=1;i<=n;i++) for (int j=i+1;j<=n;j++) Add_Edge(i+n,j,1,Seq[i]==Seq[j]?0:Cst[Seq[j]]);
    ll Ans=1ll*n*inf;
    while (Spfa()){
        if (Dst[T]>0) break;
        Ans=Ans+Dst[T]*Flow[T];
        int now=T;
        while (now!=S){
            E[Path[now]].flow-=Flow[T];
            E[Path[now]^1].flow+=Flow[T];
            now=E[Path[now]^1].v;
        }
    }
    printf("%lld\n",Ans);return 0;
}
void Add_Edge(int u,int v,int flow,ll w){
    Nt[++ecnt]=Hd[u];Hd[u]=ecnt;E[ecnt]=((Edge){v,flow,w});
    Nt[++ecnt]=Hd[v];Hd[v]=ecnt;E[ecnt]=((Edge){u,0,-w});
    return;
}
bool Spfa(){
    memset(Dst,63,sizeof(Dst));int ql=0,qr=1;Qu[1]=S;Dst[S]=0;Flow[S]=inf;
    while (ql!=qr){
        ++ql;ql%=maxN;int u=Qu[ql];
        for (int i=Hd[u];i!=-1;i=Nt[i])
            if (E[i].flow&&Dst[E[i].v]>Dst[u]+E[i].w){
                Dst[E[i].v]=Dst[u]+E[i].w;Path[E[i].v]=i;Flow[E[i].v]=min(Flow[u],E[i].flow);
                if (!inq[E[i].v]){
                    ++qr;qr%=maxN;Qu[qr]=E[i].v;inq[E[i].v]=1;
                }
            }
        inq[u]=0;
    }
    return Dst[T]!=Dst[0];
}
```