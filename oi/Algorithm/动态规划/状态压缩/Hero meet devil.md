# Hero meet devil
[HDU4899]

There is an old country and the king fell in love with a devil. The devil always asks the king to do some crazy things. Although the king used to be wise and beloved by his people. Now he is just like a boy in love and can’t refuse any request from the devil. Also, this devil is looking like a very cute Loli.  
After the ring has been destroyed, the devil doesn't feel angry, and she is attracted by z * p's wisdom and handsomeness. So she wants to find z * p out.  
But what she only knows is one part of z * p's DNA sequence S leaving on the broken ring.  
Let us denote one man's DNA sequence as a string consist of letters from ACGT. The similarity of two string S and T is the maximum common subsequence of them, denote by LCS(S,T).  
After some days, the devil finds that. The kingdom's people's DNA sequence is pairwise different, and each is of length m. And there are 4^m people in the kingdom.  
Then the devil wants to know, for each 0 <= i <= |S|, how many people in this kingdom having DNA sequence T such that LCS(S,T) = i.  
You only to tell her the result modulo 10^9+7. 

给出序列 S ，求 LCS(S,T)=x 的 T 的个数，输出每一个 x 的答案。

考虑算 LCS 时动态规划的方法，设 G[i][j] 表示 S 前 i 个与 T 的前 j 个的最长公共子序列长度，则有转移 G[i][j]=max(G[i-1][j],F[i][j-1],G[i-1][j-1]+(S[i]=T[j]) 。把这个状态压缩起来，设 F[i][g[i][1],g[i][2],g[i][3],...,g[i][|S|]] ，由于 g[i][j-1] $\le$ g[i][j] $\le$ g[i][j-1]+1 ，所有后面的状态可以差分一下用 01 状态来表示。预处理出每一种状态往后加某个字符转移到的状态，计数 DP。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int maxS=15;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m;
char str[maxS+10];
int F[2][1<<maxS],G1[maxS+10],G2[maxS+10];
int Trans[4][1<<maxS];
int Ans[maxS+10];

void Plus(int &x,int y);

int main(){
	int Case;scanf("%d",&Case);
	while (Case--){
		scanf("%s",str);n=strlen(str);
		for (int i=0;i<n;i++)
			if (str[i]=='A') str[i]=0;
			else if (str[i]=='G') str[i]=1;
			else if (str[i]=='C') str[i]=2;
			else str[i]=3;
		
		scanf("%d",&m);

		for (int i=0;i<4;i++)
			for (int j=0;j<(1<<n);j++){
				G2[0]=G1[0]=j&1;
				for (int k=1;k<n;k++)
					if (j&(1<<k)) G2[k]=G1[k]=G1[k-1]+1;
					else G2[k]=G1[k]=G1[k-1];
				
				if (str[0]==i) G2[0]=1;
				for (int k=1;k<n;k++)
					G2[k]=max(G2[k],max(G2[k-1],G1[k-1]+(str[k]==i)));
				Trans[i][j]=G2[0];
				for (int k=1;k<n;k++)
					if (G2[k]>G2[k-1]) Trans[i][j]|=(1<<k);
			}
		mem(F,0);
		F[0][0]=1;
		for (int i=0;i<m;i++){
			int now=i&1;
			mem(F[now^1],0);
			for (int j=0;j<(1<<n);j++)
				if (F[now][j])
					for (int k=0;k<4;k++)
						Plus(F[now^1][Trans[k][j]],F[now][j]);
		}

		mem(Ans,0);
		for (int i=0;i<(1<<n);i++) Plus(Ans[__builtin_popcount(i)],F[m&1][i]);

		for (int i=0;i<=n;i++) printf("%d\n",Ans[i]);
	}

	return 0;
}

void Plus(int &x,int y){
	x=(x+y)%Mod;return;
}
```