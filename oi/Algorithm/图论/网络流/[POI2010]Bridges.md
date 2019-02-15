# [POI2010]Bridges
[BZOJ2095 Luogu3511]

YYD为了减肥，他来到了瘦海，这是一个巨大的海，海中有n个小岛，小岛之间有m座桥连接，两个小岛之间不会有两座桥，并且从一个小岛可以到另外任意一个小岛。现在YYD想骑单车从小岛1出发，骑过每一座桥，到达每一个小岛，然后回到小岛1。霸中同学为了让YYD减肥成功，召唤了大风，由于是海上，风变得十分大，经过每一座桥都有不可避免的风阻碍YYD，YYD十分ddt，于是用泡芙贿赂了你，希望你能帮他找出一条承受的最大风力最小的路线。

二分答案，那么剩下的就是要判断若干有向边与无向边能否构成欧拉回路，首先判断连通性，然后的要求即所有点入度=出度。对于有向边，选择是确定的，而对于无向边，先任意制定一个方向，然后再对不合法的点建图用网络流调整，如到最后能够调整成功则说明合法，否则不合法。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1100;
const int maxM=2010*10;
const int inf=2000000000;

class Edge{
public:
    int v,flow;
};

int n,m,S,T;
int U[maxM],V[maxM],W1[maxM],W2[maxM];
int edgecnt,Head[maxN],Next[maxM];
Edge E[maxM];
int Lal[maxN],Q[maxN],cur[maxN],D[maxN],UFS[maxN];

bool check(int limit);
int find(int x);
void Add_Edge(int u,int v,int flow);
bool Bfs();
int dfs(int u,int flow);

int main(){
    scanf("%d%d",&n,&m);
    int mx=0;
    for (int i=1;i<=m;i++) scanf("%d%d%d%d",&U[i],&V[i],&W1[i],&W2[i]),mx=max(mx,max(W1[i],W2[i]));

    int l=0,r=mx,Ans=-1;
    while (l<=r){
	int mid=(l+r)>>1;
	if (check(mid)) Ans=mid,r=mid-1;
	else l=mid+1;
    }
    if (Ans==-1) printf("NIE\n");
    else printf("%d\n",Ans);return 0;
}
bool check(int limit){
    edgecnt=-1;mem(Head,-1);mem(D,0);S=n+1;T=S+1;
    for (int i=1;i<=n;i++) UFS[i]=i;
    for (int i=1;i<=m;i++)
	if ((W1[i]<=limit)||(W2[i]<=limit)){
	    UFS[find(U[i])]=find(V[i]);
	    if ((W1[i]<=limit)&&(W2[i]<=limit)){
		Add_Edge(V[i],U[i],1);
		--D[U[i]];++D[V[i]];
	    }
	    else if (W1[i]<=limit) --D[U[i]],++D[V[i]];
	    else --D[V[i]],++D[U[i]];
	}
    for (int i=2;i<=n;i++) if (find(i)!=find(1)) return 0;
    int sum=0;
    for (int i=1;i<=n;i++){
	if (D[i]%2) return 0;
	if (D[i]<0) Add_Edge(i,T,-D[i]/2);
	else if (D[i]>0) Add_Edge(S,i,D[i]/2),sum+=D[i]/2;
    }
    while (Bfs()){
	memcpy(cur,Head,sizeof(Head));
	while (int di=dfs(S,inf)) sum-=di;
    }
    return sum==0;
}
int find(int x){
    if (UFS[x]!=x) UFS[x]=find(UFS[x]);
    return UFS[x];
}
void Add_Edge(int u,int v,int flow){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0});
    return;
}
bool Bfs(){
    mem(Lal,-1);Lal[S]=1;Q[1]=S;int ql=1,qr=1;
    while (ql<=qr)
	for (int u=Q[ql++],i=Head[u];i!=-1;i=Next[i])
	    if ((E[i].flow)&&(Lal[E[i].v]==-1)){
		Lal[E[i].v]=Lal[u]+1;
		if (E[i].v==T) return 1;
		Q[++qr]=E[i].v;
	    }
    return 0;
}
int dfs(int u,int flow){
    if (u==T) return flow;
    for (int &i=cur[u];i!=-1;i=Next[i])
	if ((E[i].flow)&&(Lal[E[i].v]==Lal[u]+1))
	    if (int di=dfs(E[i].v,min(flow,E[i].flow))){
		E[i].flow-=di;E[i^1].flow+=di;return di;
	    }
    return 0;
}
```