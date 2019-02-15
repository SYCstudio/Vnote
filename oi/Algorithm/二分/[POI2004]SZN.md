# [POI2004]SZN
[BZOJ2067]

String-Toys joint-stock 公司需要你帮他们解决一个问题. 他们想制造一个没有环的连通图模型. 每个图都是由一些顶点和特定数量的边构成. 每个顶点都可以连向许多的其他顶点.一个图是连通且无环的. 图是由许多的线做成的.一条线是一条连接图中两个顶点之间的路径.由于一些技术原因,两条线之间不能有重叠的部分,要保证图中任意一条边都被且仅被一条线所覆盖.由于一些技术原因,做一个这样的图的模型的费用取决于用了多少条线以及最长的那条的长度. (每条边的长度都为1.),给出对应的图,求出最少能用多少条线以及在用最少线的情况下最长的那根线最短可以为多少. 

首先，最小线覆盖的构造方法为，在任意一个点，将上来的边一一配对，如果刚好多出来一个，则延伸到上面，否则从这个点新延伸出一个。若记 D[i] 为 i 的度数，则有 $ans1=1+ \sum D[i]/2$ 。  
考虑第二问，二分最长的边权，在每一棵子树匹配的时候，想让往上传递的那条边尽量的小，那么如果为偶数个儿子，补充一个长度为 0 的。二分哪条边延伸到上面。注意到根节点不能补充，需要直接判断。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=10100;
const int maxM=maxN<<1;
const int inf=2147483647;

int n,limit;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],D[maxN],H[maxN],Seq[maxN];

void Add_Edge(int u,int v);
bool dfs(int u,int fa);
bool check(int pos,int sz);

int main(){
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);Add_Edge(v,u);
	}

	int sum=1;
	for (int i=1;i<=n;i++) sum=sum+(D[i]-1)/2;
	int L=0,R=n,ans=n;
	do{
		limit=(L+R)>>1;
		if (dfs(1,1)) ans=limit,R=limit-1;
		else L=limit+1;
	}
	while (L<=R);

	printf("%d %d\n",sum,ans);return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;D[u]++;
	return;
}

bool dfs(int u,int fa){
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) if (dfs(V[i],u)==0) return 0;
	int scnt=0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa) Seq[++scnt]=H[V[i]]+1;

	if ((u==1)&&(scnt%2==0)){
		sort(&Seq[1],&Seq[scnt+1]);
		for (int l=1,r=scnt;l<r;l++,r--)
			if (Seq[l]+Seq[r]>limit) return 0;
		return 1;
	}
	if (scnt%2==0) Seq[++scnt]=0;
	sort(&Seq[1],&Seq[scnt+1]);
	int l=1,r=scnt,ret=-1;
	do{
		int mid=(l+r)>>1;
		if (check(mid,scnt)) ret=mid,r=mid-1;
		else l=mid+1;
	}
	while (l<=r);
	if (ret==-1) H[u]=inf;
	else H[u]=Seq[ret];
	return H[u]<=limit;
}

bool check(int pos,int sz){
	int l=1,r=sz;
	while (l<r){
		if (l==pos) {l++;continue;}
		if (r==pos) {r--;continue;}
		if (Seq[l]+Seq[r]>limit) return 0;
		l++;r--;
	}
	return 1;
}
```