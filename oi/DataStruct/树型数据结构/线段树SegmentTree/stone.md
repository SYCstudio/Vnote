# stone
[BZOJ2138]

话说Nan在海边等人，预计还要等上M分钟。为了打发时间，他玩起了石子。Nan搬来了N堆石子，编号为1到N，每堆包含Ai颗石子。每1分钟，Nan会在编号在[Li,Ri]之间的石堆中挑出任意Ki颗扔向大海（好疼的玩法），如果[Li,Ri]剩下石子不够Ki颗，则取尽量地多。为了保留扔石子的新鲜感，Nan保证任意两个区间[Li,Ri]和[Lj,Rj]，不会存在Li<=Lj&Rj<=Ri的情况，即任意两段区间不存在包含关系。可是，如果选择不当，可能无法扔出最多的石子，这时NN就会不高兴了。所以他希望制定一个计划，他告诉你他m分钟打算扔的区间[Li,Ri]以及Ki。现在他想你告诉他，在满足前i-1分钟都取到你回答的颗数的情况下，第i分钟最多能取多少个石子。

如果把石子和询问分别拆点，那么就是一个完美匹配问题。考虑用$Hall$定理优化。  
$Hall$定理，对于两个集合$X,Y$，最大匹配为$|X|$的充要条件是：对于$X$的任意一个子集$S$，设$Y$中与$S$相邻的点集为$T$，满足$|S| \le |T|$。  
但是$Hall$定理的内容要求是子集，直接枚举子集肯定是不行的，所以需要考虑题目的性质。首先知道，如果对于一个询问，枚举的子集如果没有全部枚举的话，与全部枚举没有区别，因为一个$K$能匹配的石子堆数是一定的，不会改变。另外，由于没有区间包含的情况，所以两个询问要么直接相交要么不相交。相交的话可以放在一起处理，否则互不干扰。  
所以，先去掉不会被匹配到的堆，设第$i$个询问的答案为$B[i]$，则对于任意的$1 \le l \le r \le m$有$\sum _ {i=l}^{r}B[i] \le \sum _ {i=L[l]}^{R[r]} A[i]$，转化为前缀和的形式得到$SumB[r]-SumB[l-1] \le SumA[R[r]]-SumA[L[l]-1]$，移项得到$SumB[r]-SumA[R[r]] \le SumB[l-1]-SumA[L[l]-1]$，令$C[i]=SumB[i]-SumA[R[i]],D[i]=SumB[i-1]-SumA[L[i]-1]$，那么限制就转化为$C[r] \le D[l]$。  
那么按照时间顺序来做，求$C$最小值，$D$最大值，然后区间修改前缀和，用线段树维护。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define NAME "stone"
#define sqr(x) ((x)*(x))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=40100;
const int inf=2147483647;

class Range
{
public:
	int l,r,id;
};

class SegmentData
{
public:
	int key,lz;
};

class SegmentTree
{
public:
	int opt;
	SegmentData S[maxN<<2];

	void MainTain(int now){
		if (opt==1) S[now].key=max(S[lson].key,S[rson].key)+S[now].lz;
		else S[now].key=min(S[lson].key,S[rson].key)+S[now].lz;
		return;
	}

	void Modify(int now,int l,int r,int ql,int qr,int key){
		if ((l==ql)&&(r==qr)){
			S[now].key+=key;S[now].lz+=key;return;
		}
		int mid=(l+r)>>1;
		if (qr<=mid) Modify(lson,l,mid,ql,qr,key);
		else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,key);
		else{
			Modify(lson,l,mid,ql,mid,key);Modify(rson,mid+1,r,mid+1,qr,key);
		}
		MainTain(now);
		return;
	}
	
	int Query(int now,int l,int r,int ql,int qr){
		if ((l==ql)&&(r==qr)) return S[now].key;
		int mid=(l+r)>>1;
		if (qr<=mid) return Query(lson,l,mid,ql,qr)+S[now].lz;
		else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr)+S[now].lz;
		else
		{
			if (opt==1) return max(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr))+S[now].lz;
			else return min(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr))+S[now].lz;
		}
	}
};


int n,m;
int A[maxN],B[maxN];
Range Rg[maxN];
int Num[maxN],L[maxN],R[maxN],Id[maxN];
SegmentTree S1,S2;

bool cmp(Range A,Range B);

int main()
{
	scanf("%d",&n);
	int X,Y,Z,P;
	scanf("%d%d%d%d",&X,&Y,&Z,&P);
	for (int i=1;i<=n;i++) A[i]=(sqr(i-X)%P+sqr(i-Y)%P+sqr(i-Z)%P)%P;
	scanf("%d",&m);
	
	if (m==0) return 0;
	
	scanf("%d%d%d%d%d%d",&B[1],&B[2],&X,&Y,&Z,&P);
	for (int i=3;i<=m;i++) B[i]=(X*B[i-1]%P+Y*B[i-2]%P+Z)%P;

	for (int i=1;i<=m;i++) scanf("%d%d",&Rg[i].l,&Rg[i].r),Rg[i].id=i;
	sort(&Rg[1],&Rg[m+1],cmp);

	for (int i=1,j=n=0;i<=m;i++)
	{
		for (j=max(j,Rg[i].l);j<=Rg[i].r;j++) A[++n]=A[j],Num[j]=n;
		L[Rg[i].id]=Num[Rg[i].l];R[Rg[i].id]=Num[Rg[i].r];Id[Rg[i].id]=i;
	}

	S1.opt=1;S2.opt=-1;
	for (int i=1;i<=n;i++) A[i]+=A[i-1];
	for (int i=1;i<=m;i++) S1.Modify(1,1,m,Id[i],Id[i],-A[R[i]]);
	for (int i=1;i<=m;i++) S2.Modify(1,1,m,Id[i],Id[i],-A[L[i]-1]);

	for (int i=1;i<=m;i++)
	{
		int k1=S1.Query(1,1,m,Id[i],m),k2=S2.Query(1,1,m,1,Id[i]);
		B[i]=min(B[i],k2-k1);
		printf("%d\n",B[i]);
		S1.Modify(1,1,m,Id[i],m,B[i]);
		if (Id[i]+1<=m) S2.Modify(1,1,m,Id[i]+1,m,B[i]);
	}

	return 0;
}

bool cmp(Range A,Range B){
	return A.l<B.l;
}
```