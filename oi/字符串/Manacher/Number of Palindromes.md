# Number of Palindromes
[SPOJ NUMOFPAL]

Each palindrome can be always created from the other palindromes, if a single character is also a palindrome. For example, the string "malayalam" can be created by some ways:  
* malayalam = m + ala + y + ala + m
* malayalam = m + a + l + aya + l + a + m  
We want to take the value of function NumPal(s) which is the number of different palindromes that can be created using the string S by the above method. If the same palindrome occurs more than once then all of them should be counted separately.

给定一个字符串，求其中回文串的个数。

Manacher练习，直接统计

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010*2;
const int inf=2147483647;

char Input[maxN];
int P[maxN];

int main()
{
	scanf("%s",Input+1);
	int len=strlen(Input+1);

	for (int i=len;i>=1;i--) Input[2*i]=Input[i],Input[2*i-1]='#';
	Input[0]='@';Input[len+len+2]='%';Input[1]=Input[len+len+1]='#';

	int pos=0,mxR=0;
	for (int i=1;i<=len+len;i++)
	{
		if (i<mxR) P[i]=min(P[pos*2-i],mxR-i);
		else P[i]=1;
		while (Input[i-P[i]]==Input[i+P[i]]) P[i]++;
		if (i+P[i]>mxR){
			mxR=i+P[i];pos=i;
		}
	}

	int Ans=0;
	for (int i=1;i<=len+len;i++)
		Ans=Ans+P[i]/2;
	printf("%d\n",Ans);
	return 0;
}
```