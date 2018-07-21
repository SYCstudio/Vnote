# Queries for Number of Palindromes
[CF245H]

You've got a string s = s1s2... s|s| of length |s|, consisting of lowercase English letters. There also are q queries, each query is described by two integers li, ri (1 ≤ li ≤ ri ≤ |s|). The answer to the query is the number of substrings of string s[li... ri], which are palindromes.  
String s[l... r] = slsl + 1... sr (1 ≤ l ≤ r ≤ |s|) is a substring of string s = s1s2... s|s|.

给定串$S$，每一次询问$[l,r]$的子串中的回文串个数。

预处理答案$[l,r]$，每一次枚举左起点，一边构造回文树一边累加统计，每一次新增的回文串的个数就是当前所在点的树高（除去两个根）。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=5010;
const int maxAlpha=26;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fail,len,depth;
};

int sum=0;
char Input[maxN];
int Ans[maxN][maxN];
int last,nodecnt;
Node T[maxN];

void Insert(int pos,int c);

int main()
{
	scanf("%s",Input+1);
	int len=strlen(Input+1);
	for (int l=1;l<=len;l++)
	{
		last=0;nodecnt=1;sum=0;
		T[0].fail=T[1].fail=1;
		T[0].len=0;T[1].len=-1;
		T[0].depth=T[1].depth=0;
		for (int r=l;r<=len;r++)
		{
			Insert(r,Input[r]-'a');
			Ans[l][r]=sum;
		}
		Input[l]=0;
	}

	int Q;scanf("%d",&Q);
	while (Q--)
	{
		int l,r;scanf("%d%d",&l,&r);
		printf("%d\n",Ans[l][r]);
	}

	return 0;
}

void Insert(int pos,int c)
{
	int p=last;
	while (Input[pos-1-T[p].len]!=Input[pos]) p=T[p].fail;
	if (T[p].son[c]==0)
	{
		int np=++nodecnt,q=T[p].fail;
		while (Input[pos-1-T[q].len]!=Input[pos]) q=T[q].fail;
		T[np].fail=T[q].son[c];T[np].len=T[p].len+2;T[np].depth=T[T[q].son[c]].depth+1;
		T[p].son[c]=np;
	}
	last=T[p].son[c];
	sum+=T[last].depth;return;
}
```