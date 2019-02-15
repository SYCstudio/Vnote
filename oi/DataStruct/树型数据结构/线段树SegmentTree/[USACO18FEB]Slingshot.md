# [USACO18FEB]Slingshot
[BZOJ5191 Luogu4088]

Farmer John最讨厌的农活是运输牛粪。为了精简这个过程，他产生了一个新奇的想法：与其使用拖拉机拖着装满牛粪的大车从一个地点到另一个地点，为什么不用一个巨大的便便弹弓把牛粪直接发射过去呢？（事实上，好像哪里不太对……）  
Farmer John的农场沿着一条长直道路而建，所以他农场上的每个地点都可以简单地用该地点在道路上的位置来表示（相当于数轴上的一个点）。FJ建造了$N$个弹弓（$1 \leq N \leq 10^5$），其中第$i$个弹弓可以用三个整数$x _ i$，$y _ i$以及$t _ i$描述，表示这个弹弓可以在$t _ i$单位时间内将牛粪从位置$x _ i$发射到位置$y _ i$。  
FJ有$M$堆牛粪需要运输（$1 \leq M \leq 10^5$）。第$j$堆牛粪需要从位置$a _ j$移动到位置$b _ j$。使用拖拉机运输牛粪，经过路程$d$需要消耗$d$单位时间。FJ希望通过对每一堆牛粪使用至多一次弹弓来减少运输时间。FJ驾驶没有装载牛粪的拖拉机的时间不计。  
对这$M$堆牛粪的每一堆，在FJ可以在运输过程中使用至多一次弹弓的条件下，帮助FJ求出其最小运输时间。

即对每一次询问 i 求 $min _ {j}(T _ j +|x _ j-a _ i|+|y _ j-b _ i|)$ ，分四种情况讨论，发现是四个二维数点。直接开二维线段树或者主席树都会超过空间限制，所以对四种情况分别考虑，用线段树+扫描线的方式维护最小值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Find(Arr,sz,x) (lower_bound(&Arr[1],&Arr[sz+1],x)-Arr)
#define lson (now<<1)
#define rson (lson|1)

const int maxN=101000;
const int inf=2000000000;
const int meminf=2139062143;

ll numx,X[maxN+maxN],numy,Y[maxN+maxN];

class Data
{
public:
	ll x,y,t;
};

int n,m;
Data D[maxN],Q[maxN];
ll Ans[maxN];
int Mn[maxN*8];

bool cmp(Data A,Data B);
void Modify(int now,int l,int r,int pos,int key);
int Query(int now,int l,int r,int ql,int qr);

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%lld%lld%lld",&D[i].x,&D[i].y,&D[i].t),X[++numx]=D[i].x,Y[++numy]=D[i].y;
	for (int i=1;i<=m;i++) scanf("%lld%lld",&Q[i].x,&Q[i].y),X[++numx]=Q[i].x,Y[++numy]=Q[i].y,Ans[i]=abs(Q[i].x-Q[i].y),Q[i].t=i;
	sort(&X[1],&X[numx+1]);sort(&Y[1],&Y[numy+1]);numx=unique(&X[1],&X[numx+1])-X-1;numy=unique(&Y[1],&Y[numy+1])-Y-1;


	for (int i=1;i<=n;i++) D[i].x=Find(X,numx,D[i].x),D[i].y=Find(Y,numy,D[i].y);
	for (int i=1;i<=m;i++) Q[i].x=Find(X,numx,Q[i].x),Q[i].y=Find(Y,numy,Q[i].y);
	
	sort(&D[1],&D[n+1],cmp);sort(&Q[1],&Q[m+1],cmp);

	mem(Mn,127);
	for (int i=m,j=n;i>=1;i--){
		while ((j)&&(D[j].x>=Q[i].x)) Modify(1,1,numy,D[j].y,D[j].t+X[D[j].x]+Y[D[j].y]),j--;
		if (Query(1,1,numy,Q[i].y,numy)!=meminf) Ans[Q[i].t]=min(Ans[Q[i].t],(ll)Query(1,1,numy,Q[i].y,numy)-X[Q[i].x]-Y[Q[i].y]);
	}

	mem(Mn,127);
	for (int i=1,j=1;i<=m;i++){
		while ((j<=n)&&(D[j].x<=Q[i].x)) Modify(1,1,numy,D[j].y,D[j].t-X[D[j].x]+Y[D[j].y]),j++;
		if (Query(1,1,numy,Q[i].y,numy)!=meminf) Ans[Q[i].t]=min(Ans[Q[i].t],(ll)Query(1,1,numy,Q[i].y,numy)+X[Q[i].x]-Y[Q[i].y]);
	}

	mem(Mn,127);
	for (int i=m,j=n;i>=1;i--){
		while ((j)&&(D[j].x>=Q[i].x)) Modify(1,1,numy,D[j].y,D[j].t+X[D[j].x]-Y[D[j].y]),j--;
		if (Query(1,1,numy,1,Q[i].y)!=meminf) Ans[Q[i].t]=min(Ans[Q[i].t],(ll)Query(1,1,numy,1,Q[i].y)-X[Q[i].x]+Y[Q[i].y]);
	}

	mem(Mn,127);
	for (int i=1,j=1;i<=m;i++){
		while ((j<=n)&&(D[j].x<=Q[i].x)) Modify(1,1,numy,D[j].y,D[j].t-X[D[j].x]-Y[D[j].y]),j++;
		if (Query(1,1,numy,1,Q[i].y)!=meminf) Ans[Q[i].t]=min(Ans[Q[i].t],(ll)Query(1,1,numy,1,Q[i].y)+X[Q[i].x]+Y[Q[i].y]);
	}
	for (int i=1;i<=m;i++) printf("%lld\n",Ans[i]);
	return 0;
}

bool cmp(Data A,Data B){
	if (A.x!=B.x) return A.x<B.x;
	return A.y<B.y;
}

void Modify(int now,int l,int r,int pos,int key){
	Mn[now]=min(Mn[now],key);
	if (l==r) return;
	int mid=(l+r)>>1;
	if (pos<=mid) Modify(lson,l,mid,pos,key);
	else Modify(rson,mid+1,r,pos,key);
}

int Query(int now,int l,int r,int ql,int qr){
	if ((l==ql)&&(r==qr)) return Mn[now];
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(lson,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr);
	else return min(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr));
}
```