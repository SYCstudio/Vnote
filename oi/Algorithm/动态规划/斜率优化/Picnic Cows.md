# Picnic Cows
[HDU3045]

It’s summer vocation now. After tedious milking, cows are tired and wish to take a holiday. So Farmer Carolina considers having a picnic beside the river. But there is a problem, not all the cows consider it’s a good idea! Some cows like to swim in West Lake, some prefer to have a dinner in Shangri-la ,and others want to do something different. But in order to manage expediently, Carolina coerces all cows to have a picnic!  
Farmer Carolina takes her N (1<N≤400000) cows to the destination, but she finds every cow’s degree of interest in this activity is so different that they all loss their interests. So she has to group them to different teams to make sure that every cow can go to a satisfied team. Considering about the security, she demands that there must be no less than T(1<T≤N)cows in every team. As every cow has its own interest degree of this picnic, we measure this interest degree’s unit as “Moo~”. Cows in the same team should reduce their Moo~ to the one who has the lowest Moo~ in this team——It’s not a democratical action! So Carolina wishes to minimize the TOTAL reduced Moo~s and groups N cows into several teams.  
For example, Carolina has 7 cows to picnic and their Moo~ are ‘8 5 6 2 1 7 6’ and at least 3 cows in every team. So the best solution is that cow No.2,4,5 in a team (reduce (2-1)+(5-1) Moo~)and cow No.1,3,6,7 in a team (reduce ((7-6)+(8-6)) Moo~),the answer is 8. 

题意：给出数组$A[i]$，求把这$n$个数分成若干组，每组至少$K$个元素，使得每一个数减去每组中最小值之和最小。

将数字$V$排序后，设前缀和为$S$，则有转移方程

$$F _ i=min(F _ j+S _ i-S _ j-V _ {j+1} \times (i-j)) \ j \in [1,i-K]$$   
变形后得到

$$F _ j-S _ j+j \times V _ {j+1}=i \times V _ {j+1}-S _ j+F _ i$$  
然后斜率优化之。

有两个需要注意的地方，一是需要先算出$[K,K \times 2-1]$的值，二是因为数有重复的，所以不能用除法的形式来求斜率，而应该移项转成乘法形式，而由于是不等式，所以负数乘过去需要变号。

```cpp
//斜率优化
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=401000;
const int inf=147483647;
const ll INF=1e17;

int n,K;
ll V[maxN],F[maxN],S[maxN],Q[maxN];

//ld Slope(ll x1,ll x2);
ll X(ll x1,ll x2);
ll Y(ll x1,ll x2);

int main()
{
	while (scanf("%d%d",&n,&K)!=EOF)
	{
		for (int i=1;i<=n;i++) scanf("%lld",&V[i]);
		sort(&V[1],&V[n+1]);
		mem(F,63);mem(S,0);
		for (int i=1;i<=n;i++) S[i]=S[i-1]+V[i];

		/*
		F[0]=0;
		for (int i=1;i<=n;i++)
		{
			F[i]=inf;
			for (int j=0;j+K<=i;j++)
				F[i]=min(F[i],F[j]+S[i]-S[j]-V[j+1]*(i-j));
			for (int j=0;j+K<=i;j++)
				if (F[i]==F[j]+S[i]-S[j]-V[j+1]*(i-j)){
					cout<<j<<" -> "<<i<<endl;break;
				}
		}
		for (int i=1;i<=n;i++)
			if (F[i]==inf) cout<<"inf ";
			else cout<<F[i]<<" ";
		cout<<endl;
		cout<<F[n]<<endl;
        //*/
		for (int i=K;(i<2*K)&&(i<=n);i++) F[i]=S[i]-V[1]*(ll)i;
		int L=1,R=0;
		for (int i=K+K,j=K;i<=n;i++,j++)
		{
			while ((L<R)&&(Y(Q[R-1],Q[R])*X(Q[R],j)>=Y(Q[R],j)*X(Q[R-1],Q[R]))) R--;
			Q[++R]=j;
			while ((L<R)&&(Y(Q[L],Q[L+1])>=1ll*i*X(Q[L],Q[L+1]))) L++;
			//cout<<Q[L]<<" -> "<<i<<endl;
			F[i]=F[Q[L]]+S[i]-S[Q[L]]-V[Q[L]+1]*((ll)i-Q[L]);
		}
		//*/
		//for (int i=1;i<=n;i++) cout<<F[i]<<" ";cout<<endl;
		printf("%lld\n",F[n]);
	}
	return 0;
}

/*
ld Slope(ll x1,ll x2)
{
	//cout<<"slope:"<<x1<<" "<<x2<<endl;
	if (V[x1+1]==V[x2+1]) return INF;
	return ((ld)1.0*((ld)(F[x1]-S[x1]+x1*V[x1+1])-(ld)(F[x2]-S[x2]+x2*V[x2+1])))/((ld)1.0*(V[x1+1]-V[x2+1]));
}
//*/

ll X(ll x1,ll x2)
{
	return V[x1+1]-V[x2+1];
}

ll Y(ll x1,ll x2)
{
	return (F[x1]-S[x1]+x1*V[x1+1])-(F[x2]-S[x2]+x2*V[x2+1]);
}
```