# MST Company
[CF 125E]

The MST (Meaningless State Team) company won another tender for an important state reform in Berland.  
There are n n n cities in Berland, some pairs of the cities are connected by roads. Each road has its price. One can move along any road in any direction. The MST team should carry out the repair works on some set of roads such that one can get from any city to any other one moving only along the repaired roads. Moreover, this set should contain exactly k k k capital roads (that is, the roads that start or finish in the capital). The number of the capital is 1.  
As the budget has already been approved, the MST Company will profit by finding the set with minimum lengths of roads.

求一种特殊的最小生成树。给定一个有 $n$ 个节点和 $m$ 条边的图，找出一个生成树满足从根节点 $1$ 直接连向其余节点的边要恰好是 $k$ 条，在此条件下生成树的权值和最小。

二分给所有从 $1$ 出发的边一个边权，然后求最小生成树，根据得到的最小生成树中选择的从 $1$ 出发的边的个数调整边权。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=5010;
const int maxM=101000;
const int inf=2147483647;

class Edge
{
public:
	int u,v,w,opt,id;
};

int n,m,K;
Edge E[maxM];
int mst,cnt;
int UFS[maxN];

void Calc(int C);
int Find(int x);
bool cmp(Edge A,Edge B);

int main(){
	scanf("%d%d%d",&n,&m,&K);
	int L=0,R=0,pos,tot=0;
	for (int i=1;i<=m;i++){
		scanf("%d%d%d",&E[i].u,&E[i].v,&E[i].w);
		if ((E[i].u==1)||(E[i].v==1)) E[i].opt=1,tot++;
		L-=E[i].w;R+=E[i].w;E[i].id=i;
	}

	if ((tot<K)||((K==0)&&(n>1))){
		printf("-1\n");return 0;
	}

	do{
		int mid=(L+R)>>1;
		Calc(mid);
		if (cnt>=K) pos=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);

	Calc(pos);
	printf("%d\n",n-1);
	for (int i=1;i<=n;i++) UFS[i]=i;
	tot=0;
	for (int i=1;i<=m;i++)
		if (Find(E[i].u)!=Find(E[i].v)){
			if ((E[i].opt)&&(tot==K)) continue;
			printf("%d ",E[i].id);
			if (E[i].opt) tot++;
			UFS[Find(E[i].u)]=Find(E[i].v);
		}
	printf("\n");
	return 0;
}

void Calc(int c){
	for (int i=1;i<=m;i++) if (E[i].opt) E[i].w+=c;
	sort(&E[1],&E[m+1],cmp);
	for (int i=1;i<=n;i++) UFS[i]=i;
	mst=0;cnt=0;
	for (int i=1;i<=m;i++)
		if (Find(E[i].u)!=Find(E[i].v)){
			UFS[Find(E[i].u)]=Find(E[i].v);
			mst+=E[i].w;cnt+=E[i].opt;
		}
	for (int i=1;i<=m;i++) if (E[i].opt) E[i].w-=c;
	return;
}

int Find(int x){
	if (UFS[x]!=x) UFS[x]=Find(UFS[x]);
	return UFS[x];
}

bool cmp(Edge A,Edge B){
	if (A.w!=B.w) return A.w<B.w;
	return A.opt==1;
}
```