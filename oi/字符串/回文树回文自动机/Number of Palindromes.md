# Number of Palindromes
[SPOJ NUMOFPAL]

Each palindrome can be always created from the other palindromes, if a single character is also a palindrome. For example, the string "malayalam" can be created by some ways:  
* malayalam = m + ala + y + ala + m
* malayalam = m + a + l + aya + l + a + m  
We want to take the value of function NumPal(s) which is the number of different palindromes that can be created using the string S by the above method. If the same palindrome occurs more than once then all of them should be counted separately.

给定一个字符串，求其中回文串的个数。

练习回文自动机

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int maxAlpha=26;
const int inf=2147483647;

class Node
{
public:
	int son[maxAlpha];
	int fail,len,cnt;
};

int n,last,nodecnt;
int odd=1,even=0;
Node P[maxN];
char Input[maxN];

void Insert(int p,int c);

int main()
{
	nodecnt=1;P[odd].fail=P[even].fail=odd;
	P[odd].len=-1;P[even].len=0;last=even;

	scanf("%s",Input+1);
	n=strlen(Input+1);

	for (int i=1;i<=n;i++) Insert(i,Input[i]-'a');
	for (int i=nodecnt;i>=1;i--) P[P[i].fail].cnt+=P[i].cnt;

	int Ans=0;
	for (int i=2;i<=nodecnt;i++) Ans=Ans+P[i].cnt;
	printf("%d\n",Ans);
	return 0;
}

void Insert(int pos,int c)
{
	int p=last;
	while (Input[pos-1-P[p].len]!=Input[pos]) p=P[p].fail;
	if (P[p].son[c]==0)
	{
		int np=++nodecnt,q=P[p].fail;
		while (Input[pos-1-P[q].len]!=Input[pos]) q=P[q].fail;
		P[np].fail=P[q].son[c];
		P[p].son[c]=np;P[np].len=P[p].len+2;
	}
	last=P[p].son[c];
	P[last].cnt++;
	return;
}
```