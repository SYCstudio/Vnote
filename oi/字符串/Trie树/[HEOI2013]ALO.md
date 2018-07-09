# [HEOI2013]ALO
[BZOJ3166 Luogu4098]

Welcome to ALO ( Arithmetic and Logistic Online)。这是一个 VR MMORPG， 如名字所见，到处充满了数学的谜题  
现在你拥有 n 颗宝石，每颗宝石有一个能量密度，记为 ai，这些宝石的能量 密度两两不同。现在你可以选取连续的一些宝石（必须多于一个）进行融合，设 为 ai, ai+1, …, aj，则融合而成的宝石的能量密度为这些宝石中能量密度的次大值 与其他任意一颗宝石的能量密度按位异或的值，即，设该段宝石能量密度次大值 为 k，则生成的宝石的能量密度为 max{k xor ap | ap ≠ k , i ≤ p ≤ j}  
现在你需要知道你怎么选取需要融合的宝石，才能使生成的宝石能量密度最 大

假设枚举一个数$i$，问题其实就是求在区间$[l,r]$内，$[i]$是第二大的数，与$[i]$的最大异或和。  
求最大异或和可以用$Trie$树+按位贪心的方式，从高到低贪心选择。而区间问题可以用可持久化，前缀和相减得到区间。  
那么就是维护出每一个点的最大的合法区间，在这个区间中求一个与它异或和最大的树，用可持久化$Trie$树来维护这个值，贪心按位选取。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=100100;
const int maxBit=32;
const int inf=2147483647;

class Trie
{
public:
	int size;
	int son[2];
};

int n;
int Arr[maxN],L[maxN],R[maxN];
int nodecnt,root[maxN];
Trie T[maxN*30];

void Insert(int &rt,int key);
int Query(int r1,int r2,int key);

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Arr[i]);
	for (int i=1;i<=n;i++)
	{
		int p=i,cnt=0;
		while ((p>=1)&&(cnt<=1))
			if (Arr[--p]>Arr[i]) cnt++;
		//cout<<i<<" "<<p<<" "<<cnt<<endl;
		L[i]=min(p+1,i);
		p=i;cnt=0;
		while ((p<=n)&&(cnt<=1))
			if (Arr[++p]>Arr[i]) cnt++;
		R[i]=max(p-1,i);
	}
	//for (int i=1;i<=n;i++) cout<<L[i]<<" ";cout<<endl;
	//for (int i=1;i<=n;i++) cout<<R[i]<<" ";cout<<endl;
	
	for (int i=1;i<=n;i++)
	{
		root[i]=root[i-1];
		Insert(root[i],Arr[i]);
	}

	int Ans=0;
	for (int i=1;i<=n;i++) Ans=max(Ans,Query(root[L[i]-1],root[R[i]],Arr[i]));

	printf("%d\n",Ans);
	return 0;
}

void Insert(int &rt,int key)
{
	T[++nodecnt]=T[rt];rt=nodecnt;
	T[rt].size++;
	int now=rt;
	for (int i=maxBit-1;i>=0;i--)
	{
		int bit=((key&(1<<i))!=0);
		T[++nodecnt]=T[T[now].son[bit]];T[now].son[bit]=nodecnt;
		now=T[now].son[bit];T[now].size++;
	}
	return;
}

int Query(int r1,int r2,int key)
{
	int Ret=0;
	for (int i=maxBit-1;i>=0;i--)
	{
		int bit=((key&(1<<i))!=0);
		if (T[T[r2].son[bit^1]].size-T[T[r1].son[bit^1]].size>0){
			Ret|=(1<<i);r1=T[r1].son[bit^1];r2=T[r2].son[bit^1];
		}
		else{
			r1=T[r1].son[bit];r2=T[r2].son[bit];
		}
	}
	return Ret;
}
```