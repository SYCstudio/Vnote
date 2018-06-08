# JC loves Mkk
[BZOJ3316]

![](https://www.lydsy.com/JudgeOnline/upload/201311/ff(2).jpg)  

考虑分数规划。破环成链后，二分平均值，若能找到一个和大于$0$的合法区间，则说明平均值还可以更小。  
至于求最大的合法区间，可以用单调队列来维护。注意到题目要求选择的必须是偶数个，所以用两个队列分别维护编号为奇数和偶数的。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*2;
const ld eps=1e-8;
const int inf=2147483647;

int n,ansL,ansR,L,R;
int V[maxN];
int Q[2][maxN];
ld Sum[maxN];

bool Check(ld k);
ll gcd(ll a,ll b);

int main()
{
	scanf("%d%d%d",&n,&L,&R);
	ld l=inf,r=0;
	for (int i=1;i<=n;i++) scanf("%d",&V[i]),V[i+n]=V[i],l=min(l,(ld)V[i]),r=max(r,(ld)V[i]);
	if (L&1) L++;if (R&1) R--;
	l-=eps;r+=eps;
	do
	{
		ld mid=(l+r)/2.0;
		//cout<<"("<<l<<","<<r<<")"<<endl;
		if (Check(mid)) l=mid+eps;
		else r=mid-eps;
	}
	while (l+eps<=r);
	//cout<<ansL<<" "<<ansR<<endl;
	ll sum=0;
	for (int i=ansL;i<=ansR;i++) sum+=V[i];
	ll g=gcd(abs(sum),ansR-ansL+1);
	if (g==ansR-ansL+1) printf("%lld\n",sum/g);
	else printf("%lld/%lld\n",sum/g,(ansR-ansL+1)/g);
	return 0;
}

bool Check(ld k)
{
	for (int i=1;i<=n+n;i++) Sum[i]=Sum[i-1]+V[i]-k;
	int l[2]={1,1},r[2]={0,0};
	for (int i=L,opt=0;i<=n+n;i++,opt^=1)
	{
		int p=max(i-R+1,1),q=i-L+1;
		//cout<<i<<" ("<<p<<","<<q<<")"<<endl;
		while ((l[opt]<=r[opt])&&(Sum[Q[opt][r[opt]]-1]>=Sum[q-1])) r[opt]--;
		Q[opt][++r[opt]]=q;
		while ((l[opt]<r[opt])&&(Q[opt][l[opt]]<p)) l[opt]++;
		if (Sum[i]-Sum[Q[opt][l[opt]]-1]>=0)
		{
			ansL=Q[opt][l[opt]];ansR=i;
			return 1;
		}
	}
	return 0;
}

ll gcd(ll a,ll b)
{
	ll t;
	while (b) t=a,a=b,b=t%b;
	return a;
}
```