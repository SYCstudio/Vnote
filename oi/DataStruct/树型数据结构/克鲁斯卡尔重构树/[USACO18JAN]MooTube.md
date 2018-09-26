# [USACO18JAN]MooTube
[BZOJ5188 Luogu4185]

在业余时间，Farmer John创建了一个新的视频共享服务，他将其命名为MooTube。在MooTube上，Farmer John的奶牛可以录制，分享和发现许多有趣的视频。他的奶牛已经发布了 $N$ 个视频 ( $1 \leq N \leq 100,000$ )，为了方便将其编号为 $1 \ldots N$ 。然而，FJ无法弄清楚如何帮助他的奶牛找到他们可能喜欢的新视频。  
FJ希望为每个MooTube视频创建一个“推荐视频”列表。这样，奶牛将被推荐与他们已经观看过的视频最相关的视频。  
FJ设计了一个“相关性”度量标准，顾名思义，它确定了两个视频相互之间的相关性。他选择 $N-1$ 对视频并手动计算其之间的相关性。然后，FJ将他的视频建成一棵树，其中每个视频是节点，并且他手动将 $N-1$ 对视频连接。为了方便，FJ选择了 $N-1$ 对，这样任意视频都可以通过一条连通路径到达任意其他视频。 FJ决定将任意一对视频的相关性定义为沿此路径的任何连接的最小相关性。  
Farmer John想要选择一个 $K$ 值，以便在任何给定的MooTube视频旁边，推荐所有其他与该视频至少有 $K$ 相关的视频。然而，FJ担心会向他的奶牛推荐太多的视频，这可能会分散他们对产奶的注意力！因此，他想设定适当的 $K$ 值。 Farmer John希望得到您的帮助，回答有关 $K$ 值的推荐视频的一些问题。

把边按照边权从大到小排序后加入，构建克鲁斯卡尔重构树，查询就在树上倍增地跳父亲。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=100100*2;
const int maxBit=20;
const int inf=2147483647;

class Edge
{
public:
	int u,v,w;
};

int n,Q;
int nodecnt=0,Fa[maxBit][maxN],NodeW[maxN],UFS[maxN],Size[maxN];
Edge E[maxN];

bool cmp(Edge A,Edge B);
int Find(int x);

int main(){
	scanf("%d%d",&n,&Q);nodecnt=n;
	for (int i=1;i<n;i++) scanf("%d%d%d",&E[i].u,&E[i].v,&E[i].w);
	for (int i=1;i<=n;i++) UFS[i]=i,NodeW[i]=inf,Size[i]=1;
	sort(&E[1],&E[n],cmp);
	for (int i=1;i<n;i++){
		++nodecnt;
		int u=Find(E[i].u),v=Find(E[i].v);
		Fa[0][u]=Fa[0][v]=nodecnt;
		Size[nodecnt]=Size[u]+Size[v];
		NodeW[nodecnt]=E[i].w;UFS[u]=UFS[v]=nodecnt;UFS[nodecnt]=nodecnt;
	}
	for (int i=1;i<maxBit;i++)
		for (int j=1;j<=nodecnt;j++)
			if (Fa[i-1][j]) Fa[i][j]=Fa[i-1][Fa[i-1][j]];

	while (Q--){
		int k,v;scanf("%d%d",&k,&v);
		for (int i=maxBit-1;i>=0;i--) if ((Fa[i][v])&&(NodeW[Fa[i][v]]>=k)) v=Fa[i][v];
		printf("%d\n",Size[v]-1);
	}

	return 0;
}

bool cmp(Edge A,Edge B){
	return A.w>B.w;
}

int Find(int x){
	if (UFS[x]!=x) UFS[x]=Find(UFS[x]);
	return UFS[x];
}
```
