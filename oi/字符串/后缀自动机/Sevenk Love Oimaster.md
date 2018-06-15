# Sevenk Love Oimaster
[BZOJ2780 SPOJ8093]

有n个大串和m个询问，每次给出一个字符串s询问在多少个大串中出现过

把$n$个大串构建广义后缀自动机，然后对每一个节点标记出它是多少个大串的子串结尾，然后对于询问依次匹配。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<string>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=361000;
const int maxAlpha=26;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fa,len;
};

int n,q;
int nodecnt=1,root=1,last=1;
Node S[maxN<<1];
string str[maxN],Str;
int Cnt[maxN<<1],Id[maxN<<1];

void Insert(int c);

int main()
{
	ios::sync_with_stdio(false);
	cin>>n>>q;
	for (int i=1;i<=n;i++)
	{
		cin>>str[i];
		last=1;
		for (int j=0;j<str[i].size();j++) Insert(str[i][j]-'a');
	}

	for (int i=1;i<=n;i++)
	{
		int now=root;
		for (int j=0;j<str[i].size();j++)
		{
			int c=str[i][j]-'a';
			now=S[now].son[c];
			int p=now;
			while ((p!=0)&&(Id[p]!=i)) Cnt[p]++,Id[p]=i,p=S[p].fa;
		}
	}

	for (int i=1;i<=q;i++)
	{
		int now=root;
		cin>>Str;
		for (int j=0;j<Str.size();j++) now=S[now].son[Str[j]-'a'];
		printf("%d\n",Cnt[now]);
	}

	return 0;
}

void Insert(int c)
{
	/*
	if ((S[last].son[c]!=0)&&(S[last].len+1==S[S[last].son[c]].len)){
		last=S[last].son[c];
		return;
	}
	//*/
	int np=++nodecnt,p=last;last=nodecnt;
	S[np].len=S[p].len+1;
	while ((p!=0)&&(S[p].son[c]==0)) S[p].son[c]=np,p=S[p].fa;
	if (p==0) S[np].fa=root;
	else
	{
		int q=S[p].son[c];
		if (S[p].len+1==S[q].len) S[np].fa=q;
		else
		{
			int nq=++nodecnt;S[nq]=S[q];S[nq].len=S[p].len+1;
			S[np].fa=S[q].fa=nq;
			while ((p!=0)&&(S[p].son[c]==q)) S[p].son[c]=nq,p=S[p].fa;
		}
	}
	return;
}
```