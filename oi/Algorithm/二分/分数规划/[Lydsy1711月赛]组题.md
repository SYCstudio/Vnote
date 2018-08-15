# [Lydsy1711月赛]组题
[BZOJ5090]

著名出题人小Q的备忘录上共有n道可以出的题目，按照顺序依次编号为1到n，其中第i道题目的难度系数被小Q估计为$a_i$，难度系数越高，题目越难，负数表示这道题目非常简单。小Q现在要出一套难题，他决定从备忘录中选取编号连续的若干道题目，使得平均难度系数最高。当然，小Q不能做得太过分，一套题目必须至少包含k道题目，因此他不能通过直接选取难度系数最高的那道题目来组成一套题。请写一个程序，帮助小Q挑选平均难度系数最高的题目。

题意：给出一列数，求最大的至少连续$K$个数的平均值

分数规划，二分平均值，问题转化为求长度至少为$K$的最大子段和，维护一个前缀和最小值即可计算。  
需要注意的是，本题直接二分会$TLE$，解决办法是限制二分次数。

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
#define RG register
#define IL inline

const int maxN=101000;
const ld eps=1e-6;
const int inf=2147483647;
const ll INF=1e18;

int n,K,ansL,ansR;
ll Val[maxN];
ld Sum[maxN];

bool Check(RG ld k);
ll gcd(RG ll a,RG ll b);

int main()
{
	scanf("%d%d",&n,&K);
	RG ld L=INF,R=-INF;
	for (RG int i=1;i<=n;i++) scanf("%lld",&Val[i]),L=min(L,(ld)Val[i]),R=max(R,(ld)Val[i]);
	L-=eps;R+=eps;
	int cnt=0;
	do
	{
		if (++cnt>=40) break;
		RG ld mid=(L+R)/2.0;
		if (Check(mid)) L=mid+eps;
		else R=mid-eps;
	}
	while (L+eps<=R);
	RG ll sum=0;
	for (RG int i=ansL;i<=ansR;i++) sum+=Val[i];
	RG ll g=gcd(abs(sum),ansR-ansL+1);
	printf("%lld/%lld\n",sum/g,(ansR-ansL+1)/g);
	return 0;
}

bool Check(RG ld k)
{
	for (RG int i=1;i<=n;i++) Sum[i]=Sum[i-1]+Val[i]-k;
	for (RG int i=K,pos=0;i<=n;i++)
	{
		if (Sum[i]>=Sum[pos])
		{
			ansL=pos+1;ansR=i;
			return 1;
		}
		if (Sum[i-K+1]<Sum[pos]) pos=i-K+1;
	}
	return 0;
}

ll gcd(RG ll a,RG ll b)
{
	RG ll t;
	while (b) t=a,a=b,b=t%b;
	return a;
}
```