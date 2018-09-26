# [USACO18OPEN]Disruption
[BZOJ5279 Luogu4374]

Farmer John自豪于他所经营的交通发达的的农场。这个农场是由$N$块牧场（$2 \leq N \leq 50,000$）组成的，$N-1$条双向道路将它们连接起来，每一条道路的都为一单位长度。Farmer John注意到，从任何一块牧场到另一块牧场，都能通过一组合适的道路到达。  
尽管FJ的农场现在是连通的，他担心如果有一条道路被阻断会发生什么，因为这事实上会将他的农场分为两个不相交的牧场集合，奶牛们只能够在每一个集合内移动但不能在集合间移动。于是FJ又建造了$M$条额外的双向道路（$1 \leq M \leq 50,000$），每一条的长度都是一个至多为$10^9$的正整数。奶牛们仍然可以使用原有的道路进行移动，除非其中的某些被阻断了。  
如果某条原有的道路被阻断了，农场就会被分为两块不相交的区域，那么FJ就会从他的额外修建的道路中选择一条能够重建这两块区域的连通性的，取代原来那条，从而奶牛们又可以从任何一块牧场去往另一块牧场。  
对于农场上每一条原有的道路，帮助FJ选出最短的替代用的道路。

树链剖分，然后链上最小值覆盖。  
直接做是两个 log 的，如果换成对于每一条重链单独开一棵线段树就可以做到一个 log 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=101000;
const int maxM=maxN<<1;
const int meminf=2139062143;
const int inf=2147483647;

class SegmentData
{
public:
	int mn,ls,rs;
};

int n,m;
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM];
int Size[maxN],Hs[maxN],Fa[maxN],Top[maxN],Dph[maxN];
int nodecnt=0,rt[maxN],dfncnt,dfn[maxN],fst[maxN],lst[maxN];
SegmentData S[maxN*50];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int top);
void Cover(int u,int v,int w);
void Modify(int &now,int l,int r,int ql,int qr,int key);
int Query(int now,int l,int r,int pos);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&m);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}

	Dph[1]=1;dfs1(1,1);dfs2(1,1);

	while (m--){
		int u,v,w;scanf("%d%d%d",&u,&v,&w);
		Cover(u,v,w);
	}

	for (int i=0;i<=edgecnt;i+=2){
		int mn=meminf;
		if (Dph[V[i]]>Dph[V[i^1]]) mn=Query(rt[Top[V[i]]],fst[Top[V[i]]],lst[Top[V[i]]],dfn[V[i]]);
		else mn=Query(rt[Top[V[i^1]]],fst[Top[V[i^1]]],lst[Top[V[i^1]]],dfn[V[i^1]]);
		if (mn==inf) printf("-1\n");
		else printf("%d\n",mn);
	}
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	Size[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Dph[V[i]]=Dph[u]+1;Fa[V[i]]=u;
			dfs1(V[i],u);Size[u]+=Size[V[i]];
			if (Size[V[i]]>Size[Hs[u]]) Hs[u]=V[i];
		}
	return;
}

void dfs2(int u,int top){
	Top[u]=top;dfn[u]=++dfncnt;
	if (fst[top]==0) fst[top]=dfncnt;lst[top]=dfncnt;
	if (Hs[u]==0) return;
	dfs2(Hs[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=Hs[u]))
			dfs2(V[i],V[i]);
	return;
}

void Modify(int &now,int l,int r,int ql,int qr,int key){
	if (now==0) now=++nodecnt,S[now].mn=inf;
	if ((l==ql)&&(r==qr)){
		S[now].mn=min(S[now].mn,key);return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Modify(S[now].ls,l,mid,ql,qr,key);
	else if (ql>=mid+1) Modify(S[now].rs,mid+1,r,ql,qr,key);
	else{
		Modify(S[now].ls,l,mid,ql,mid,key);
		Modify(S[now].rs,mid+1,r,mid+1,qr,key);
	}
	return;
}

int Query(int now,int l,int r,int pos){
	if (now==0) return inf;
	if (l==r) return S[now].mn;
	int mid=(l+r)>>1;
	if (pos<=mid) return min(S[now].mn,Query(S[now].ls,l,mid,pos));
	else return min(S[now].mn,Query(S[now].rs,mid+1,r,pos));
}

void Cover(int u,int v,int w){
	while (Top[u]!=Top[v]){
		if (Dph[Top[u]]<Dph[Top[v]]) swap(u,v);
		Modify(rt[Top[u]],fst[Top[u]],lst[Top[u]],dfn[Top[u]],dfn[u],w);
		u=Fa[Top[u]];
	}
	if (Dph[u]>Dph[v]) swap(u,v);
	if (u!=v) 	Modify(rt[Top[u]],fst[Top[u]],lst[Top[u]],dfn[u]+1,dfn[v],w);
	return;
}
```