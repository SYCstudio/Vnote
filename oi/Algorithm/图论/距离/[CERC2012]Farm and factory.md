# [CERC2012]Farm and factory
[BZOJ4061]

向Byteland的国王Bitolomew致敬！国王Bitolomew认为Byteland是一个独一无二的国家。它太小了，它所有的市民（包括国外）都只在农场或工厂之一工作，其中农场和工厂是两个不同的城市。因此每天早晨，每个城市的居民都在去这两个城市的路上通行。Byteland的交通网络包括一些连接两个不同城市的无向的道路，道路不会连向国家之外的城市（但是隧道和桥可能会这样）。两个城市间可能存在多条无向的道路。保证农场和工厂与所有城市连通。几个月前，为了改善交通状况，国王Bitolomew出台了过路费的政策，需要每个市民每次在通过相应道路时支付固定的费用Bitolomew希望这能引导市民重新考虑他们的上班路线，从而使得交通更加均匀畅通。国王的点子被他的谏者证明是不够完美的。每个Byteland的市民现在都开始走起了最便宜的上班路线。国王Bitolomew完全没想到会出现这种情况，然而过路费带来的收入着实提高了国家财政的收入。事实上，国王现在的经济状况实在是太好了，所以他准备在一个新的首都建一个新的城堡。新的首都必须和一些其他的城市通过无向的道路相连，这样才能从新首都到达每个城市。新建的道路可以设定非负的过路费（特别地，这里的过路费可以不是整数）。国王Bitolomew真的很讨厌车辆路过他的城堡所产生的噪声。他希望通过合理设定新道路的过路费使得从任意除了新首都之外的城市v到农场或工厂都不会经过新首都（注意这里v还包括农场和工厂）。另外，由于国王也要交过路费，所以他希望最小化从新首都到其他每个城市的平均过路费。请你帮助国王计算一下最小可能的平均值是多少吧。

设 F[x],G[x] 分别表示 x 到 1,2 的最短路，设 S[x] 表示 x 到 新建点的最短路，那么根据最短路不等式，有 $F[x] \le S[x]+S[1],S[1] \le F[x]+S[x]$ ，那么就有 $S[x] \ge |F[x]-S[1]|$ ，同理对 G 有 $S[x] \ge |G[x]-S[2]|$ ，合并一下就是 $S[x] \ge \max(|F[x]-S[1]|,|G[x]-S[2]|)$ ，问题转化为求平面上一个点到其它 n 个点的切比雪夫距离最小，旋转 45 度后化为曼哈顿距离，横列分开，取中位数。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
#include<cmath>
using namespace std;

typedef long long ll;
typedef pair<int,int> pii;
#define ft first
#define sd second
const int maxN=101000;
const int maxM=303000<<1;
const ll INF=1e18;

int n,m;
int edgecnt=-1,Hd[maxN],Nt[maxM],V[maxM],W[maxM];
ll D1[maxN],D2[maxN];
double X[maxN],Y[maxN];
bool vis[maxN];
priority_queue<pair<ll,int> > H;

void Add_Edge(int u,int v,int w);
void Dijkstra(int S,ll *D);
int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        scanf("%d%d",&n,&m);memset(Hd,-1,sizeof(Hd));edgecnt=-1;
        for (int i=1;i<=m;i++){
            int u,v,w;scanf("%d%d%d",&u,&v,&w);Add_Edge(u,v,w);Add_Edge(v,u,w);
        }
        Dijkstra(1,D1);Dijkstra(2,D2);
        for (int i=1;i<=n;i++) X[i]=0.5*(D1[i]+D2[i]),Y[i]=0.5*(D1[i]-D2[i]);
        sort(&X[1],&X[n+1]);sort(&Y[1],&Y[n+1]);
        double Ans=0;int mid=(n+1)/2;
        for (int i=1;i<=n;i++) Ans+=fabs(X[mid]-X[i])+fabs(Y[mid]-Y[i]);
        printf("%.10lf\n",Ans/n);
    }
    return 0;
}
void Add_Edge(int u,int v,int w){
    Nt[++edgecnt]=Hd[u];Hd[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
    return;
}
void Dijkstra(int S,ll *D){
    for (int i=1;i<=n;i++) D[i]=INF,vis[i]=0;while (!H.empty()) H.pop();
    D[S]=0;H.push(make_pair(0,S));
    while (!H.empty()){
        int u=H.top().sd;H.pop();
        if (vis[u]) continue;vis[u]=1;
        for (int i=Hd[u];i!=-1;i=Nt[i]) if (D[V[i]]>D[u]+W[i]) H.push(make_pair(-(D[V[i]]=D[u]+W[i]),V[i]));
    }
    return;
}
```