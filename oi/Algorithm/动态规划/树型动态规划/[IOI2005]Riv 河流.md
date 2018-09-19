# [IOI2005]Riv 河流
[BZOJ1812 Luogu3354]

几乎整个Byteland王国都被森林和河流所覆盖。小点的河汇聚到一起，形成了稍大点的河。就这样，所有的河水都汇聚并流进了一条大河，最后这条大河流进了大海。这条大河的入海口处有一个村庄——名叫Bytetown。  
在Byteland国，有n个伐木的村庄，这些村庄都座落在河边。目前在Bytetown，有一个巨大的伐木场，它处理着全国砍下的所有木料。木料被砍下后，顺着河流而被运到Bytetown的伐木场。Byteland的国王决定，为了减少运输木料的费用，再额外地建造k个伐木场。这k个伐木场将被建在其他村庄里。这些伐木场建造后，木料就不用都被送到Bytetown了，它们可以在运输过程中第一个碰到的新伐木场被处理。显然，如果伐木场座落的那个村子就不用再付运送木料的费用了。它们可以直接被本村的伐木场处理。  
注：所有的河流都不会分叉，形成一棵树，根结点是Bytetown。  
国王的大臣计算出了每个村子每年要产多少木料，你的任务是决定在哪些村子建设伐木场能获得最小的运费。其中运费的计算方法为：每一吨木料每千米1分钱。

考虑如何计算贡献，那么可以设 F[i][u][j] 其中 u 是 i 的某一级祖先，表示在 i 的子树内， i 以上最近的设置伐木场的位置为 u ，包括 i 上面的这个 u 一共在 i 的子树内设置 j 个伐木场的最小代价，那么由于最近的伐木场祖先是知道的，所以可以子树内的贡献都已经计算完毕。转移有两种，一种是从儿子转移过来的时候儿子并没有在儿子的子树内解决，需要到与 i 相同的那个祖先去解决；另一种是儿子在儿子自己的子树内已经解决了，也就是说在儿子处放置了一个伐木场。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=110;
const int maxM=maxN<<1;
const int maxK=55;
const int inf=2147483647;

int n,K;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],W[maxM],Depth[maxN],Size[maxN];
int F[maxN][maxN][maxK],G[maxN][maxN],St[maxN],NW[maxN];

void Add_Edge(int u,int v,int w);
void dfs(int u,int fa,int dep);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&K);K++;
	for (int i=1;i<=n;i++){
		int w,v,d;scanf("%d%d%d",&w,&v,&d);NW[i+1]=w;v++;
		Add_Edge(i+1,v,d);Add_Edge(v,i+1,d);
	}
	n++;

	Depth[1]=0;
	dfs(1,1,1);

	printf("%d\n",F[1][1][K]);

	return 0;
}

void Add_Edge(int u,int v,int w){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
	return;
}

void dfs(int u,int fa,int dep){
	St[dep]=u;Size[u]=1;
	for (int d=1;d<dep;d++) F[u][St[d]][1]=NW[u]*(Depth[u]-Depth[St[d]]);
	
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			int v=V[i];Depth[v]=Depth[u]+W[i];//cout<<u<<"->"<<v<<endl;
			dfs(v,u,dep+1);
			for (int d=1;d<=dep;d++) for (int s=1;s<=min(K,Size[u]+Size[v]);s++) G[St[d]][s]=inf;
			for (int d=1;d<=dep;d++)
				for (int s=1;s<=min(K,Size[u]);s++)
					for (int ss=1;ss+s-1<=min(Size[u]+Size[v],K);ss++)
						G[St[d]][s+ss-1]=min(G[St[d]][s+ss-1],F[u][St[d]][s]+F[v][St[d]][ss]);
			for (int d=1;d<=dep;d++)
				for (int s=1;s<=min(K,Size[u]);s++)
					for (int ss=1;s+ss<=min(Size[u]+Size[v],K);ss++)
						G[St[d]][s+ss]=min(G[St[d]][s+ss],F[u][St[d]][s]+F[v][v][ss]);
			for (int d=1;d<=dep;d++) for (int s=1;s<=min(K,Size[u]+Size[v]);s++) F[u][St[d]][s]=G[St[d]][s];
			Size[u]+=Size[v];
		}
	return;
}
```