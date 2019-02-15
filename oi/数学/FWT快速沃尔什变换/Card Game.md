# Card Game
[CSU1911]

Alice and Bob now love to play a card game. Everyone is starting n cards, each card has no more than m attribute. Now they need finish Q tasks, each task will require everyone to give a card, and then make up the attribute types that the task demands (e.g. the task required attributes A, B, C, Alice’s card contains A B and Bob’s card contains B, C. they can use this union to finish the task).
For each task, How many ways that Alice and Bob can do this task.

给定两个数列，有若干询问，每一次询问一个数，问有多少种方案使得从两列数中各选出一个能使得或起来是询问的数。

两个数列做或卷积，FWT。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxM=1<<19;
const int inf=2147483647;

int n,m;
int A[maxN],B[maxN];

void FWT(int *P,int N,int opt);

int main()
{
	int TTT;scanf("%d",&TTT);
	for (int ti=1;ti<=TTT;ti++)
	{
		mem(A,0);mem(B,0);
		scanf("%d%d",&n,&m);
		for (int i=1;i<=n;i++)
		{
			ll k;scanf("%lld",&k);
			int key=0;
			for (int j=0;j<m;j++,k/=10)
				if (k%10==1) key|=(1<<j);
			A[key]++;
		}
		for (int i=1;i<=n;i++)
		{
			ll k;scanf("%lld",&k);
			int key=0;
			for (int j=0;j<m;j++,k/=10)
				if (k%10==1) key|=(1<<j);
			B[key]++;
		}

		FWT(A,1<<m,1);FWT(B,1<<m,1);
		for (int i=0;i<(1<<m);i++) A[i]=A[i]*B[i];
		FWT(A,1<<m,-1);

		int Q;scanf("%d",&Q);
		printf("Case #%d:\n",ti);
		while (Q--)
		{
			ll k;scanf("%lld",&k);
			int key=0;
			for (int j=0;j<m;j++,k/=10)
				if (k%10==1) key|=(1<<j);
			printf("%d\n",A[key]);
		}
	}
	return 0;
}

void FWT(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
				P[j+k+i]+=opt*P[j+k];
	return;
}
```