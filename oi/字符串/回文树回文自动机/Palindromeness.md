# Palindromeness
[Codechef PALPROB]

Let us define the palindromeness of a string in the following way:

    If the string is not a palindrome, its' palindromeness is zero.
    The palindromeness of an one-letter string is 1.
    The palindromness of a string S of the length greater than one is 1 + "palindromeness of the string that is formed by the first [|S|/2] symbols of S".

Let us consider some examples for better understanding:

    The palindromeness of the string zxqfd is 0, since the string is not a palindrome.
    The palindromeness of the string a is 1, by definition.
    The palindromeness of the string aa is 2, beucase for "aa" we get 1 + palindromeness of "a", that is one, so we get 2.
    The palindromeness of the string abacaba is 3.

You are given a string S. Find the sum of the palindromenesses of all the non empty substrings of S (i.e. S[i..j], where i <= j). In other words, you have to calculate the sum of palindromenesses of N * (N + 1) / 2 substrings of S, where N is the length of S.

定义串的回文价值，若串不是回文串，则为$0$；否则若长度为$1$，则为$1$；否则，等于前一半串的回文价值$+1$。现在给定一个字符串，求其所有子串的回文价值之和。

由于非回文串的回文价值为$0$，所以只要考虑回文串。建出回文自动机后，从小到大倍增找到前一半的地方，然后累加过来，乘以当前回文自动机节点表示的串的个数。

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
const int maxBit=16;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fail,len;
	ll cnt,num;
};

char str[maxN];
int last,nodecnt;
Node S[maxN];
int Fa[maxBit][maxN];

void Insert(int pos,int c);

int main()
{
	int TTT;scanf("%d",&TTT);
	while (TTT--)
	{
		scanf("%s",str+1);
		int len=strlen(str+1);
		last=0;nodecnt=1;mem(S,0);
		S[1].fail=S[0].fail=1;
		S[1].len=-1;S[0].len=0;
		for (int i=1;i<=len;i++) Insert(i,str[i]-'a');

		for (int i=2;i<=nodecnt;i++) Fa[0][i]=S[i].fail;
		for (int i=nodecnt;i>=2;i--) S[S[i].fail].cnt+=S[i].cnt;

		for (int i=1;i<maxBit;i++)
			for (int j=2;j<=nodecnt;j++)
				Fa[i][j]=Fa[i-1][Fa[i-1][j]];

		ll Ans=0;
		for (int i=2;i<=nodecnt;i++)
			if (S[i].len==1)
			{
				S[i].num=1;
				Ans+=1ll*S[i].cnt;
			}
			else
			{
				int l=S[i].len/2,now=i;
				for (int j=maxBit-1;j>=0;j--) if ((Fa[j][now])&&(S[Fa[j][now]].len>=l)) now=Fa[j][now];
				if (S[now].len==l) S[i].num=S[now].num+1;
				else S[i].num=1;
				Ans+=1ll*S[i].num*S[i].cnt;
			}

		printf("%lld\n",Ans);
	}

	return 0;
}

void Insert(int pos,int c)
{
	int p=last;
	while (str[pos-1-S[p].len]!=str[pos]) p=S[p].fail;
	if (S[p].son[c]==0)
	{
		int np=++nodecnt,q=S[p].fail;
		while (str[pos-1-S[q].len]!=str[pos]) q=S[q].fail;
		S[np].len=S[p].len+2;S[np].fail=S[q].son[c];
		S[p].son[c]=np;
	}
	last=S[p].son[c];
	S[last].cnt++;
	return;
}
```