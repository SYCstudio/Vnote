# party
[2018.6.24party]

Treeland 国有 n 座城市, 其中 1 号城市是首都. 这些城市被一些 单向 高铁线路相连, 对于城市 i 6 = 1, 有一条线路从 i 到 p i (p i < i). 每一条线路都是一样长的, 通行花费时间也是一样长的.这个国家的每一个城市都有一种特产, 整个国家有 m 种特产 (不同城市可能有相同的特产), 其中城市 i 的特产用 a i 表示.  
小 C 和他的几位 A 队爷朋友 (总共 c 人, 2 ≤ c ≤ 5) 正在 Treeland 国游玩, 他们准备在一个城市进行 water party. 召开 party 的城市必须满足每个人从各自城市出发能 尽快到齐. 注意 可能有人在同一个城市.  
小 C 和他的朋友们准备各自带一些特产到 party. 这些特产必须满足以下条件:  
• 每个人带的特产数量必须相同  
• party 里不能够有任何两种相同的特产  
• 每个人只能带他所经过的城市的特产  
对于每个询问, 计算出 party 中最多有多少种特产.

首先每一次所有人一定是到$lca$处，那么每一个人可以得到的特产种类固定，考虑用$bitset$来对于每一个询问维护每一个人能够得到的特产种类，那么就可以推出$DP[S]$表示选择的人的集合是$S$的时候可以选择的特产。假设$C$个人每人选择$x$个特产，那么可以建立一个左边$C\times x$个点、右边$m$个点的二分图，根据$Hall$定理，存在完美匹配当且仅当对于左边任意$k$个点，右边都有至少$k$个点相连。所以$x$的答案就是$min(\frac{DP[S]}{|S|})$。  
至于求$lca$和求路径上的$bitset$的或，可以用树链剖分来实现。树链剖分求区间合并，如果用线段树的话是$O(log\_n^2)$的，记录一下$u$到其$top$这一段的和，这样就只要在最后在线段树上查找了，复杂度降到$O(log\_n)$

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<bitset>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define NAME "party"
#define BIT bitset<maxM>
#define lson (now<<1)
#define rson (lson|1)

const int maxN=401000;
const int maxM=1001;
const int inf=2147483647;

int n,m,Q;
int Kind[maxN],Node[10];
int edgecnt=0,Head[maxN],Next[maxN<<1],V[maxN<<1];
int Size[maxN],MxSon[maxN],Depth[maxN],Fa[maxN],Top[maxN],idcnt,Id[maxN],Uid[maxN];
BIT Pre[maxN],S[maxN<<2],DP[1<<7];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int top);
int GetLCA(int u,int v);
void Build(int now,int l,int r);
void Query(int now,int l,int r,int ql,int qr,BIT &B);
void GetBIT(int u,int lca,BIT &B);
int Count(int S);

int main()
{
	mem(Head,-1);
	freopen(NAME".in","r",stdin);freopen(NAME".out","w",stdout);
	scanf("%d%d%d",&n,&m,&Q);
	for (int i=2;i<=n;i++)
	{
		int fa;scanf("%d",&fa);
		Add_Edge(i,fa);
	}
	for (int i=1;i<=n;i++) scanf("%d",&Kind[i]),Pre[i][Kind[i]]=1;

	dfs1(1,0);dfs2(1,1);
	Build(1,1,n);

	/*
	for (int i=1;i<=n;i++)
	{
		cout<<i<<":"<<Top[i]<<" ";
		for (int j=1;j<=m;j++) cout<<Pre[i][j];cout<<endl;
	}
	//*/

	while (Q--)
	{
		int C;scanf("%d",&C);
		for (int i=1;i<=C;i++) scanf("%d",&Node[i]);
		int lca=Node[1];
		for (int i=1;i<=C;i++)
			for (int j=i;j<=C;j++)
			{
				int u=GetLCA(Node[i],Node[j]);
				if (Depth[u]<Depth[lca]) lca=u;
			}
		//cout<<"lca:"<<lca<<endl;
		mem(DP,0);
		for (int i=1;i<=C;i++) GetBIT(Node[i],lca,DP[1<<(i-1)]);

		/*
		for (int i=1;i<=C;i++)
		{
			cout<<i<<":"<<endl;
			for (int j=1;j<=m;j++) cout<<DP[1<<(i-1)][j];cout<<endl;
		}
		//*/
		
		for (int i=0;i<(1<<C);i++)
			if (Count(i)>1)
			{
				int p=(i)&(-i);
				DP[i]=DP[p]|DP[i^p];
			}
		int Ans=inf;
		for (int i=1;i<(1<<C);i++)
			Ans=min(Ans,(int)(DP[i].count()/Count(i)));

		printf("%d\n",Ans*C);
	}
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
	return;
}

void dfs1(int u,int fa)
{
	Size[u]=1;MxSon[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Depth[V[i]]=Depth[u]+1;
			Fa[V[i]]=u;dfs1(V[i],u);
			Size[u]+=Size[V[i]];
			if (Size[MxSon[u]]<Size[V[i]]) MxSon[u]=V[i];
		}
	return;
}

void dfs2(int u,int top)
{
	Top[u]=top;Uid[Id[u]=++idcnt]=u;
	if (MxSon[u]==0) return;
	Pre[MxSon[u]]|=Pre[u];
	dfs2(MxSon[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=MxSon[u]))
			dfs2(V[i],V[i]);
	return;
}

int GetLCA(int u,int v)
{
	while (Top[u]!=Top[v])
	{
		if (Depth[Top[u]]<Depth[Top[v]]) swap(u,v);
		u=Fa[Top[u]];
	}
	if (Depth[u]>Depth[v]) swap(u,v);
	return u;
}

void Build(int now,int l,int r)
{
	if (l==r){
		S[now][Kind[Uid[l]]]=1;return;
	}
	int mid=(l+r)>>1;
	Build(lson,l,mid);Build(rson,mid+1,r);
	S[now]=S[lson]|S[rson];
	return;
}

void Query(int now,int l,int r,int ql,int qr,BIT &B)
{
	if ((l==ql)&&(r==qr)){
		B|=S[now];return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Query(lson,l,mid,ql,qr,B);
	else if (ql>=mid+1) Query(rson,mid+1,r,ql,qr,B);
	else{
		Query(lson,l,mid,ql,mid,B);Query(rson,mid+1,r,mid+1,qr,B);
	}
	return;
}

void GetBIT(int u,int lca,BIT &B)
{
	while (Top[u]!=Top[lca]){
		B|=Pre[u];u=Fa[Top[u]];
	}
	Query(1,1,n,Id[lca],Id[u],B);
	return;
}

int Count(int S)
{
	int Ret=0;
	while (S) S-=((S)&(-S)),Ret++;
	return Ret;
}
```