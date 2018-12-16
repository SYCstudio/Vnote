# [COCI2009]ALADIN
[BZOJ1938 Luogu4433]

有一个长度为 N 的序列P 和两种操作，共 Q个： 1. 给定 L, R, A, B，将第 L 到第 R 个之间的每个元素 Px 变成（（X-L+1）×A）mod B 。 2. 给定 L, R，询问第 L 到第 R 个元素的和。 数据规模：N≤10^9 ，Q≤50000 ， A, B≤106 

注意到序列操作可以用线段树来维护，而求值可以用类欧。

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

const int maxN=50100*2;
const ll Mob=1e16;
const int inf=2147483647;

class SegmentData
{
public:
	int a,b,st,l,r;
};

class Option
{
public:
	int opt,l,r,a,b;
};

int n,m,num,Num[maxN*2];
Option O[maxN];
SegmentData S[maxN<<2];
ll As[maxN<<2];

int Dsp(int x);
void Label(int now,int l,int r);
void PushDown(int now);
void Calc(int now,int a,int b,int st);
ll Get(int a,int b,int n);
ll Lgcd(ll a,ll b,ll c,int n);
void Modify(int now,int l,int r,int ql,int qr,int a,int b,int st);
ll Query(int now,int l,int r,int ql,int qr);

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=m;i++){
		scanf("%d%d%d",&O[i].opt,&O[i].l,&O[i].r);Num[++num]=O[i].l;Num[++num]=O[i].r+1;
		if (O[i].opt==1) scanf("%d%d",&O[i].a,&O[i].b),O[i].a%=O[i].b;
	}
	sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;Num[num+1]=1000000000;
	Label(1,1,num);
	for (int i=1;i<=m;i++){
		if (O[i].opt==1) Modify(1,1,num,Dsp(O[i].l),Dsp(O[i].r),O[i].a,O[i].b,O[i].l);
		else if (O[i].opt==2) printf("%lld\n",Query(1,1,num,Dsp(O[i].l),Dsp(O[i].r)));
	}
	return 0;
}

int Dsp(int x){
	int k=lower_bound(&Num[1],&Num[num+1],x)-Num;
	if (Num[k]>x) --k;return k;
}

void Label(int now,int l,int r){
	S[now].l=Num[l];S[now].r=Num[r+1]-1;S[now].a=-1;if (l==r) return;
	int mid=(l+r)>>1;Label(lson,l,mid);Label(rson,mid+1,r);
	return;
}

void PushDown(int now){
	if (S[now].a==-1) return;
	Calc(lson,S[now].a,S[now].b,S[now].st);
	Calc(rson,S[now].a,S[now].b,S[now].st);
	S[now].a=-1;return;
}

void Calc(int now,int a,int b,int st){
	S[now].a=a;S[now].b=b;S[now].st=st;
	As[now]=Get(a,b,S[now].r-st+1)-Get(a,b,S[now].l-st);
	return;
}

ll Get(int a,int b,int n){
	if (b==1) return 0;
	if (n>=b) return Get(a,b,b-1)*(ll)(n/b)+Get(a,b,n%b);
	return 1ll*n*(n+1)/2ll*a-1ll*b*Lgcd(a,0,b,n);
}

ll Lgcd(ll a,ll b,ll c,int n){
	if (n<0) return 0;
	if (n==0) return (b/c);
	if (a==0) return (ll)(b/c)*(n+1);
	if ((a>=c)||(b>=c)) return Lgcd(a%c,b%c,c,n)+1ll*n*(n+1)/2ll*(ll)(a/c)+1ll*(n+1)*(ll)(b/c);
	ll m=(a*n+b)/c;
	return m*n-Lgcd(c,c-b-1,a,m-1);
}

void Modify(int now,int l,int r,int ql,int qr,int a,int b,int st){
	if ((l==ql)&&(r==qr)){
		Calc(now,a,b,st);
		return;
	}
	PushDown(now);int mid=(l+r)>>1;
	if (qr<=mid) Modify(lson,l,mid,ql,qr,a,b,st);
	else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,a,b,st);
	else{
		Modify(lson,l,mid,ql,mid,a,b,st);Modify(rson,mid+1,r,mid+1,qr,a,b,st);
	}
	As[now]=As[lson]+As[rson];return;
}

ll Query(int now,int l,int r,int ql,int qr){
	if ((l==ql)&&(r==qr)) return As[now];
	PushDown(now);int mid=(l+r)>>1;
	if (qr<=mid) return Query(lson,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr);
	else return Query(lson,l,mid,ql,mid)+Query(rson,mid+1,r,mid+1,qr);
}
```