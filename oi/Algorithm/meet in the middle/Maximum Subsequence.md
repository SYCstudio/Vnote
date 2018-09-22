# Maximum Subsequence
[CF888E]

You are given an array a consisting of n integers, and additionally an integer m. You have to choose some sequence of indices b1, b2, ..., bk (1 ≤ b1 < b2 < ... < bk ≤ n) in such a way that the value of![CF888E](_v_images/_cf888e_1537602734_1384710930.png)is maximized. Chosen sequence can be empty.

meet in the middle ，分成两半，然后组合答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=40;
const int maxM=1010000;
const int inf=2147483647;

int n,m,Seq[maxN];
int n1,n2,N1[maxM],N2[maxM];

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);

	int mid=n/2;
	for (int S=0;S<(1<<mid);S++){
		int sum=0;
		for (int i=0;i<mid;i++)
			if (S&(1<<i)) sum=(sum+Seq[i+1])%m;
		N1[++n1]=sum;
	}
	for (int S=0;S<(1<<(n-mid));S++){
		int sum=0;
		for (int i=0;i<n-mid;i++)
			if (S&(1<<i)) sum=(sum+Seq[i+mid+1])%m;
		N2[++n2]=sum;
	}

	sort(&N1[1],&N1[n1+1]);n1=unique(&N1[1],&N1[n1+1])-N1-1;
	sort(&N2[1],&N2[n2+1]);n2=unique(&N2[1],&N2[n2+1])-N2-1;

	int mx=max(N1[n1],N2[n2]);
	for (int i=1;i<=n1;i++){
		int p=lower_bound(&N2[1],&N2[n2+1],m-1-N1[i])-N2;
		if (N2[p]>m-1-N1[i]) p--;
		mx=max(mx,N1[i]+N2[p]);
		mx=max(mx,(N1[i]+N2[n2])%m);
	}

	printf("%d\n",mx);return 0;
}
```