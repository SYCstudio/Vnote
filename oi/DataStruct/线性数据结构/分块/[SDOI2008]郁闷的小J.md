# [SDOI2008]郁闷的小J
[Luogu2464]

小J是国家图书馆的一位图书管理员，他的工作是管理一个巨大的书架。虽然他很能吃苦耐劳，但是由于这个书架十分巨大，所以他的工作效率总是很低，以致他面临着被解雇的危险，这也正是他所郁闷的。  
具体说来，书架由N个书位组成，编号从1到N。每个书位放着一本书，每本书有一个特定的编码。  
小J的工作有两类：  
1.图书馆经常购置新书，而书架任意时刻都是满的，所以只得将某位置的书拿掉并换成新购的书。  
2.小J需要回答顾客的查询，顾客会询问某一段连续的书位中某一特定编码的书有多少本。  
例如，共5个书位，开始时书位上的书编码为1，2，3，4，5  
一位顾客询问书位1到书位3中编码为“2”的书共多少本，得到的回答为：1  
一位顾客询问书位1到书位3中编码为“1”的书共多少本，得到的回答为：1  
此时，图书馆购进一本编码为“1”的书，并将它放到2号书位。  
一位顾客询问书位1到书位3中编码为“2”的书共多少本，得到的回答为：0  
一位顾客询问书位1到书位3中编码为“1”的书共多少本，得到的回答为：2  
……  
你的任务是写一个程序来回答每个顾客的询问。

直接分块。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Find(x) (lower_bound(&Num[1],&Num[numcnt+1],x)-Num)

const int maxN=100005;
const int blocksize=320;
const int inf=2147483647;

class Option
{
public:
	int opt;
	int l,r,c,p;
};

int n,m;
int Val[maxN];
int L[maxN],R[maxN],Belong[maxN];
int numcnt,Num[maxN*4],Cnt[blocksize][maxN];
Option O[maxN];

int main()
{
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Num[++numcnt]=Val[i];
	for (int i=1;i<=m;i++)
	{
		char ch;scanf(" %c",&ch);
		if (ch=='Q'){
			O[i].opt=1;
			scanf("%d%d%d",&O[i].l,&O[i].r,&O[i].c);
			Num[++numcnt]=O[i].c;
		}
		if (ch=='C'){
			O[i].opt=2;
			scanf("%d%d",&O[i].p,&O[i].c);
			Num[++numcnt]=O[i].c;
		}
	}

	sort(&Num[1],&Num[numcnt+1]);numcnt=unique(&Num[1],&Num[numcnt+1])-Num-1;

	for (int i=1;i<=n;i++)
	{
		Belong[i]=i/blocksize+1;
		if (L[Belong[i]]==0) L[Belong[i]]=i;
		R[Belong[i]]=i;
	}

	for (int i=1;i<=n;i++) Cnt[Belong[i]][Val[i]=Find(Val[i])]++;

	for (int i=1;i<=m;i++)
	{
		if (O[i].opt==1)
		{
			int c=Find(O[i].c),Ans=0;
			if (Belong[O[i].l]==Belong[O[i].r]){
				for (int j=O[i].l;j<=O[i].r;j++) if (Val[j]==c) Ans++;
			}
			else{
				for (int j=Belong[O[i].l]+1;j<=Belong[O[i].r]-1;j++) Ans+=Cnt[j][c];
				for (int j=O[i].l;j<=R[Belong[O[i].l]];j++) if (Val[j]==c) Ans++;
				for (int j=L[Belong[O[i].r]];j<=O[i].r;j++) if (Val[j]==c) Ans++;
			}
			printf("%d\n",Ans);
		}
		if (O[i].opt==2)
		{
			int c=Find(O[i].c);
			Cnt[Belong[O[i].p]][Val[O[i].p]]--;
			Cnt[Belong[O[i].p]][Val[O[i].p]=c]++;
		}
	}
	return 0;
}
```