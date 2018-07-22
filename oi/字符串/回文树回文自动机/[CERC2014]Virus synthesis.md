# [CERC2014]Virus synthesis
[BZOJ4044 Luogu4762]

Viruses are usually bad for your health. How about fighting them with... other viruses? In this problem, you need to find out how to synthesize such good viruses.We have prepared for you a set of strings of the letters A, G, T and C. They correspond to the DNA nucleotide sequences of viruses that we want to svnthesize, using the following operations:  
* Adding a nucleotide either to the beginning or the end of the existing sequence  
* Replicating the sequence, reversing the copied piece, and gluing it either to the beginmng or to the end of the original (so that e.g., AGTC can become AGTCCTGA or CTGAAGTC).  
We're concerned about efficiency, since we have very many such sequences, some of them verv long. Find a wav to svnthesize them in a mmimum number of operations.

对于一个字符串，有两种操作，第一种是选择一边加上任意一个字符；第二种是把当前字符串复制一遍加到后面。现在给定一个字符串，开始时是空串，求得到给定字符串的最少操作次数。

可以发现，答案等于$\min(n-len[i]+F[i])$，其中$i$代表某一个回文子串，$len$为其长度，$F$为构造出其的步数。注意第二个操作是复制一遍，所以这里的回文串单指偶数长度的回文串。那么现在的问题在于如何求出每一个回文子串的构造步数。有两种方法，第一种是在其两边各去掉一个字符，这样可以再加一步得到当前字符串；第二种则是由一个小于等于其以一半的回文串，先补齐到其一半，再复制一遍得到。两者取最小值。

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
const int maxAlpha=26;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fail,len,fa;
	void clear(){
		fail=len=fa=0;mem(son,0);return;
	}
};

char str[maxN];
int nodecnt,last;
Node S[maxN];
int Pos[maxN],F[maxN];

void Insert(int pos,int c);

int main()
{
	int TTT;scanf("%d",&TTT);
	while (TTT--)
	{
		mem(str,-1);
		scanf("%s",str+1);
		int len=strlen(str+1);
		for (int i=1;i<=len;i++)
			if (str[i]=='A') str[i]=0;
			else if (str[i]=='T') str[i]=1;
			else if (str[i]=='G') str[i]=2;
			else str[i]=3;

		last=0;nodecnt=1;Pos[0]=Pos[1]=0;S[0].clear();S[1].clear();
		S[0].fail=S[1].fail=1;
		S[0].len=0;S[1].len=-1;
		for (int i=1;i<=len;i++) Insert(i,str[i]);

		for (int i=2;i<=nodecnt;i++) F[i]=S[i].len;

		int Ans=len;F[0]=1;
		for (int i=2;i<=nodecnt;i++)
			if ((S[i].len&1)==0)
			{
				int l=S[i].len/2,now=Pos[i];
				F[i]=S[i].len;
				F[i]=min(F[i],F[S[i].fa]+1);
				if (S[now].len>l) continue;
				F[i]=min(F[i],F[now]+l-S[now].len+1);
			}

		for (int i=2;i<=nodecnt;i++) Ans=min(Ans,len-S[i].len+F[i]);

		printf("%d\n",Ans);
	}
	return 0;
}

void Insert(int pos,int c)
{
	int p=last;
	while (str[pos-1-S[p].len]!=str[pos]) p=S[p].fail;
	if (S[p].son[c]==0)
	{
		int np=++nodecnt,q=S[p].fail;S[np].clear();Pos[np]=0;
		while (str[pos-1-S[q].len]!=str[pos]) q=S[q].fail;
		S[np].fail=S[q].son[c];
		S[p].son[c]=np;S[np].len=S[p].len+2;
		S[np].fa=p;
		if (S[np].len<=2){
			Pos[np]=S[np].fail;
		}
		else{
			int now=Pos[p];
			while ((str[pos-1-S[now].len]!=str[pos])||(S[now].len*2+4>S[np].len)) now=S[now].fail;
			Pos[np]=S[now].son[c];
		}
	}
	last=S[p].son[c];
	return;
}
```