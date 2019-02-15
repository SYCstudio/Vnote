# Palisection
[CF17E]

In an English class Nick had nothing to do at all, and remembered about wonderful strings called palindromes. We should remind you that a string is called a palindrome if it can be read the same way both from left to right and from right to left. Here are examples of such strings: «eye», «pop», «level», «aba», «deed», «racecar», «rotor», «madam».  
Nick started to look carefully for all palindromes in the text that they were reading in the class. For each occurrence of each palindrome in the text he wrote a pair — the position of the beginning and the position of the ending of this occurrence in the text. Nick called each occurrence of each palindrome he found in the text subpalindrome. When he found all the subpalindromes, he decided to find out how many different pairs among these subpalindromes cross. Two subpalindromes cross if they cover common positions in the text. No palindrome can cross itself.  
Let's look at the actions, performed by Nick, by the example of text «babb». At first he wrote out all subpalindromes:  
• «b» — 1..1  
• «bab» — 1..3  
• «a» — 2..2  
• «b» — 3..3  
• «bb» — 3..4  
• «b» — 4..4  
Then Nick counted the amount of different pairs among these subpalindromes that cross. These pairs were six:  
1. 1..1 cross with 1..3  
2. 1..3 cross with 2..2  
3. 1..3 cross with 3..3  
4. 1..3 cross with 3..4  
5. 3..3 cross with 3..4  
6. 3..4 cross with 4..4  
Since it's very exhausting to perform all the described actions manually, Nick asked you to help him and write a program that can find out the amount of different subpalindrome pairs that cross. Two subpalindrome pairs are regarded as different if one of the pairs contains a subpalindrome that the other does not.  

给出一个串，求其中重叠的回文串对数。

正难则反，重叠的回文串对数等于任意两个回文串的对数减去不相交的回文串对数。不相交的可以对每一个位置维护以它开头和结尾的回文串个数，对其中一个作前缀和或后缀和，这样就可以枚举中间的断点然后将两边组合计数。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=2000010;
const int Mod=51123987;
const int inf=2147483647;

class Node
{
public:
	int fail,len,depth;
};

int n;
char str[maxN];
int C1[maxN],C2[maxN];
int last,nodecnt;
Node S[maxN];
int edgecnt,Head[maxN],Next[maxN],V[maxN],Ch[maxN];

void Insert(int pos,int c);

int main()
{
	scanf("%d",&n);
	scanf("%s",str+1);

	last=0;nodecnt=1;mem(Head,-1);edgecnt=0;
	S[1].fail=S[0].fail=1;
	S[0].len=0;S[1].len=-1;
	S[0].depth=S[1].depth=0;
	for (int i=1;i<=n;i++){
		Insert(i,str[i]-'a');
		C1[i]=S[last].depth;
	}

	reverse(&str[1],&str[n+1]);
	mem(S,0);
	last=0;nodecnt=1;mem(Head,-1);edgecnt=0;
	S[1].fail=S[0].fail=1;
	S[0].len=0;S[1].len=-1;
	S[0].depth=S[1].depth=0;
	for (int i=1;i<=n;i++){
		Insert(i,str[i]-'a');
		C2[i]=S[last].depth;
	}
	reverse(&C2[1],&C2[n+1]);

	//for (int i=1;i<=n;i++) cout<<C1[i]<<" ";cout<<endl;
	//for (int i=1;i<=n;i++) cout<<C2[i]<<" ";cout<<endl;

	ll Ans=0;
	for (int i=1;i<=n;i++) Ans=(Ans+C1[i])%Mod;
	Ans=1ll*Ans*(Ans-1)/2%Mod;

	for (int i=1;i<=n;i++) C1[i]=(C1[i]+C1[i-1])%Mod;
	for (int i=1;i<n;i++) Ans=(Ans-1ll*C1[i]*C2[i+1]%Mod+Mod)%Mod;

	printf("%lld\n",Ans);

	return 0;
}

void Insert(int pos,int c)
{
	int p=last;
	while (str[pos-1-S[p].len]!=str[pos]) p=S[p].fail;
	bool flag=0;
	for (int i=Head[p];i!=-1;i=Next[i])
		if (Ch[i]==c){
			flag=1;break;
		}
	if (flag==0)
	{
		int np=++nodecnt,q=S[p].fail;
		while (str[pos-1-S[q].len]!=str[pos]) q=S[q].fail;
		S[np].len=S[p].len+2;
		S[np].depth=1;S[np].fail=0;
		for (int i=Head[q];i!=-1;i=Next[i])
			if (Ch[i]==c){
				S[np].depth=S[V[i]].depth+1;
				S[np].fail=V[i];
			}
		Next[++edgecnt]=Head[p];Head[p]=edgecnt;V[edgecnt]=np;Ch[edgecnt]=c;
	}
	for (int i=Head[p];i!=-1;i=Next[i])
		if (Ch[i]==c){
			last=V[i];break;
		}
	return;
}
```