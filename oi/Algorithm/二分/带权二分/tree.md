# tree
[BZOJ2654 Luogu2619]

给你一个无向带权连通图，每条边是黑色或白色。让你求一棵最小权的恰好有need条白色边的生成树。  
题目保证有解。

假设给白色的边加上$c=[-mx,mx]$的边权，那么当$c$越大的时候，选择的白色边越少，反之越多。那么二分这个权值，作一次最小生成树，以选择的白色边数来决策左右端点的移动。  
但是可能不会出现刚好$K$条的情况，那么在排序的时候，相同边权边把白色排在前面，这样在大于等于$K$的时候也可以更新答案。由于保证有解，所以这样做是没问题的。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50100;
const int maxM=100100;
const int inf=2147483647;

class Edge
{
public:
	int u,v,w,opt;
};

int n,m,K;
Edge E[maxM];
int UFS[maxN];
int mst;

int Calc(int val);
int Find(int x);
bool cmp(Edge A,Edge B);

int main(){
	scanf("%d%d%d",&n,&m,&K);
	int mxW=0;
	for (int i=1;i<=m;i++) scanf("%d%d%d%d",&E[i].u,&E[i].v,&E[i].w,&E[i].opt),mxW=max(mxW,E[i].w),E[i].u++,E[i].v++;
	int L=-mxW,R=mxW,Ans=-1;
	do{
		int mid=(L+R)>>1;
		if (Calc(mid)>=K) Ans=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);

	Calc(Ans);
	printf("%d\n",mst-K*Ans);

	return 0;
}

int Calc(int val){
	for (int i=1;i<=m;i++) if (E[i].opt==0) E[i].w+=val;
	for (int i=1;i<=n;i++) UFS[i]=i;
	sort(&E[1],&E[m+1],cmp);mst=0;
	int cnt=0;
	for (int i=1;i<=m;i++)
		if (Find(E[i].u)!=Find(E[i].v)){
			mst+=E[i].w;cnt+=(E[i].opt==0);
			UFS[Find(E[i].u)]=Find(E[i].v);
		}
	for (int i=1;i<=m;i++) if (E[i].opt==0) E[i].w-=val;
	return cnt;
}

int Find(int x){
	if (UFS[x]!=x) UFS[x]=Find(UFS[x]);
	return UFS[x];
}

bool cmp(Edge A,Edge B){
	if (A.w!=B.w) return A.w<B.w;
	else return A.opt<B.opt;
}
```