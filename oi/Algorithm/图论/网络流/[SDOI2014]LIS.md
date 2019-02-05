# [SDOI2014]LIS
[BZOJ3532 Luogu3308]

给定序列A，序列中的每一项Ai有删除代价Bi和附加属性Ci。请删除若干项，使得A的最长上升子序列长度减少至少1，且付出的代价之和最小，并输出方案。 如果有多种方案，请输出将删去项的附加属性排序之后，字典序最小的一种。

首先 $n^2$ 得到以每一个位置结尾的最长上升子序列长度，拆点，对应转移连边，这样最小割就是最小付出代价。  
然后考虑如何使得输出方案的字典序最小。把所有点按照附加属性排序，从小往大考虑每一个点。若当前点与它的拆点之间不连通，说明在当前方案中是可以把它割开的，同时又因为要字典序最小，所以当前这个点是必须割的，把这条边割掉，然后把对应的流量退掉，即退流。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=710*2;
const int maxM=maxN*maxN*2;
const int inf=1000000000;

class Edge{
public:
    int v,flow;
};

int n,m;
int A[maxN],B[maxN],F[maxN];
int edgecnt,Head[maxN],Next[maxM],V[maxM];
Edge E[maxM];
int Q[maxN],Dph[maxN],cur[maxN],St[maxN];
pair<int,int> Sorter[maxN];

void Add_Edge(int u,int v,int flow);
bool Bfs(int S,int T);
int dfs(int u,int flow,int T);

int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
		edgecnt=-1;mem(Head,-1);
		scanf("%d",&n);
		for (int i=1;i<=n;i++) scanf("%d",&A[i]);
		for (int i=1;i<=n;i++) scanf("%d",&B[i]);
		for (int i=1;i<=n;i++) scanf("%d",&Sorter[i].first),Sorter[i].second=i;
		for (int i=1;i<=n;i++){
			F[i]=1;
			for (int j=1;j<i;j++) if (A[j]<A[i]) F[i]=max(F[i],F[j]+1);
		}

		int S=n+n+1,T=S+1,mx=1;
		for (int i=1;i<=n;i++) mx=max(mx,F[i]);
		for (int i=1;i<=n;i++){
			Add_Edge(i,i+n,B[i]);
			if (F[i]==1) Add_Edge(S,i,inf);
			if (F[i]==mx) Add_Edge(i+n,T,inf);
			for (int j=i+1;j<=n;j++) if ((A[j]>A[i])&&(F[j]==F[i]+1)) Add_Edge(i+n,j,inf);
		}

		int Ans=0;
		while (Bfs(S,T)){
			for (int i=1;i<=T;i++) cur[i]=Head[i];
			while (int di=dfs(S,inf,T)) Ans+=di;
		}

		sort(&Sorter[1],&Sorter[n+1]);int top=0;
		int sum=0;
		for (int p=1;p<=n;p++){
			int u=Sorter[p].second;
			if (Bfs(u,u+n)) continue;
			St[++top]=u;sum+=B[u];
			int flow=B[u],di;
			while (Bfs(u,S)&&flow){
				for (int i=1;i<=T;i++) cur[i]=Head[i];
				do{
					di=dfs(u,flow,S);flow-=di;
				}
				while (di&&flow);
			}
			flow=B[u];
			while (Bfs(T,u+n)&&flow){
				for (int i=1;i<=T;i++) cur[i]=Head[i];
				do{
					di=dfs(T,flow,u+n);flow-=di;
				}
				while (di&&flow);
			}
			for (int i=Head[u];i!=-1;i=Next[i])
				if (E[i].v==u+n){
					E[i].flow=E[i^1].flow=0;
				}
		}
		sort(&St[1],&St[top+1]);
		printf("%d %d\n",Ans,top);
		for (int i=1;i<=top;i++) printf("%d ",St[i]);printf("\n");
    }
    return 0;
}

void Add_Edge(int u,int v,int flow){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
    Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0});
    return;
}
bool Bfs(int S,int T){
    mem(Dph,-1);Dph[S]=1;int ql=0,qr=1;Q[1]=S;
    while (ql<qr)
		for (int u=Q[++ql],i=Head[u];i!=-1;i=Next[i])
			if ((E[i].flow)&&(Dph[E[i].v]==-1)){
				Dph[E[i].v]=Dph[u]+1;if (E[i].v==T) return 1;
				Q[++qr]=E[i].v;
			}
    return 0;
}
int dfs(int u,int flow,int T){
    if (u==T) return flow;int sum=0;
    for (int &i=cur[u];i!=-1;i=Next[i])
		if ((E[i].flow)&&(Dph[E[i].v]==Dph[u]+1))
			if (int di=dfs(E[i].v,min(flow,E[i].flow),T)){
				E[i].flow-=di;E[i^1].flow+=di;return di;
			}
    return 0;
}
```