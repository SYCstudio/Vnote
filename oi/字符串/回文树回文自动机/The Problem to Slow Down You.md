# The Problem to Slow Down You
[UVAlive7041]

给出两个串，求两个串相同的回文串的对数。

分别对两个串建立回文自动机，然后同时从根出发（注意是两个根，所以要两遍），遍历都拥有的节点，相乘组合答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=201000;
const int maxAlpha=26;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fail,len,cnt;
	void clear(){
		mem(son,0);fail=len=cnt=0;return;
	}
};

class PAM
{
public:
	Node S[maxN];
	int last,nodecnt,pos;
	char str[maxN];
	
	void Init(){
		mem(str,'\0');pos=0;
		last=0;nodecnt=1;S[0].clear();S[1].clear();
		S[0].len=0;S[1].len=-1;
		S[0].fail=S[1].fail=1;
		return;
	}

	void Insert(int c){
		str[++pos]=c+10;
		int p=last;
		while (str[pos-1-S[p].len]!=str[pos]) p=S[p].fail;
		if (S[p].son[c]==0){
			int np=++nodecnt,q=S[p].fail;S[np].clear();
			while (str[pos-1-S[q].len]!=str[pos]) q=S[q].fail;
			S[np].len=S[p].len+2;S[np].fail=S[q].son[c];S[p].son[c]=np;
		}
		last=S[p].son[c];S[last].cnt++;
		return;
	}

	void Calc(){
		for (int i=nodecnt;i>=2;i--) S[S[i].fail].cnt+=S[i].cnt;
		S[0].cnt=S[1].cnt=0;
		return;
	}
};

char str1[maxN],str2[maxN];
PAM P1,P2;
ll Ans=0;

void dfs(int r1,int r2);

int main()
{
	int TTT;scanf("%d",&TTT);
	for (int ti=1;ti<=TTT;ti++)
	{
		P1.Init();P2.Init();
		scanf("%s",str1+1);
		scanf("%s",str2+1);
		int l1=strlen(str1+1),l2=strlen(str2+1);
		for (int i=1;i<=l1;i++) P1.Insert(str1[i]-'a');
		for (int i=1;i<=l2;i++) P2.Insert(str2[i]-'a');

		P1.Calc();P2.Calc();

		Ans=0;
		dfs(0,0);
		dfs(1,1);

		printf("Case #%d: %lld\n",ti,Ans);
	}
	return 0;
}

void dfs(int r1,int r2)
{
	Ans=Ans+1ll*P1.S[r1].cnt*P2.S[r2].cnt;
	for (int i=0;i<maxAlpha;i++)
		if ((P1.S[r1].son[i])&&(P2.S[r2].son[i])) dfs(P1.S[r1].son[i],P2.S[r2].son[i]);
	return;
}
```